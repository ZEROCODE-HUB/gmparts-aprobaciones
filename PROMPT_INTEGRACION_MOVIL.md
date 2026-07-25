# Prompt: Integrar web-client de aprobaciones en app Flutter GM Parts

## Contexto

Se ha implementado un web-client independiente (Next.js + Vercel) en `https://gmparts-aprobaciones.vercel.app` con dos flujos:
- `/cotizacion?key=<uuid>` — cliente ve cotización y la aprueba
- `/conformidad?key=<uuid>` — cliente ve informe final, responde encuesta y da conformidad

Las URLs se generan mediante Cloud Functions (`generateLink`) que crean un UUID, lo guardan en Firestore como `quote_access_key` o `report_access_key`, y retornan la URL completa.

La app Flutter actual tiene URLs hardcodeadas a FlutterFlow que deben reemplazarse.

---

## Cambios necesarios en la app Flutter

### 1. Crear helper para llamar a Cloud Functions

Crear `lib/custom_code/actions/generate_link.dart`:

```dart
import 'package:cloud_functions/cloud_functions.dart';

/// Llama a la Cloud Function generateLink y retorna la URL
Future<String> generateLink(int receptionId, String purpose) async {
  final functions = FirebaseFunctions.instanceFor(region: 'us-central1');
  final result = await functions.httpsCallable('generateLink').call({
    'receptionId': receptionId,
    'purpose': purpose,
  });
  return result.data['url'] as String;
}
```

### 2. Reemplazar URL en d_controldecalidadenviarcliente_widget.dart

**Archivo:** `lib/diagnostico/d_controldecalidadenviarcliente/d_controldecalidadenviarcliente_widget.dart`

**Línea actual (aprox 153):**
```dart
link: 'https://gmpartsprueba.flutterflow.app/encuestacliente?id=',
```

**Reemplazar por:**
```dart
link: await generateLink(widget.id!, 'report'),
```

El método debe cambiar a `async` y el `link` debe ser el resultado del await. El constructor `EnvioclienteWidget` ahora recibe el link completo (incluyendo el UUID), no necesita concatenar `id`.

Importar:
```dart
import '/custom_code/actions/generate_link.dart';
```

### 3. Crear nuevo flujo para cotización

**Archivo:** `lib/diagnostico/recepcion_asedor_de_servicio/g_linkcliente_cotizacion/g_linkcliente_cotizacion_widget.dart`

Actualmente el botón "Enviar" solo actualiza status y navega. Debe cambiarse a:

1. Llamar `generateLink(widget.id!, 'quote')` para obtener URL
2. Abrir modal `EnvioclienteWidget` con el link completo
3. Al cerrar el modal, actualizar status y navegar (comportamiento actual)

Código sugerido para el onPressed del botón "Enviar":

```dart
onPressed: () async {
  final url = await generateLink(widget.id!, 'quote');
  await showModalBottomSheet(
    isScrollControlled: true,
    backgroundColor: Colors.transparent,
    enableDrag: false,
    context: context,
    builder: (context) {
      return EnvioclienteWidget(link: url, id: widget.id);
    },
  );
  await gLinkclienteCotizacionRecepcionesRecord.reference.update(
    createRecepcionesRecordData(status: FFAppConstants.Enreparacion),
  );
  context.pushNamed(
    HAprobacionclientecotizWidget.routeName,
    queryParameters: {'id': serializeParam(widget.id?.toString(), ParamType.String)}.withoutNulls,
  );
},
```

### 4. Actualizar EnvioclienteWidget para recibir link completo

**Archivo:** `lib/diagnostico/recepcion_asedor_de_servicio/enviocliente/enviocliente_widget.dart`

El widget actual recibe `link` (base URL) e `id` (int) y concatena: `$link$id`. Con el nuevo sistema, el `link` ya viene completo desde `generateLink`.

Cambiar:
```dart
class EnvioclienteWidget extends StatefulWidget {
  const EnvioclienteWidget({
    super.key,
    required this.link,   // Ahora es String (no nullable) y viene completo
    this.id,
  });

  final String link;  // ← cambiar de String? a String
  final int? id;
```

Y en todos los usos de `widget.link`, usar directamente `widget.link` sin concatenar `widget.id?`:

**WhatsApp:**
```dart
await launchURL('https://api.whatsapp.com/send?text=${Uri.encodeComponent(widget.link)}');
```

**Email:**
```dart
final emailUri = Uri(
  scheme: 'mailto',
  path: '',
  queryParameters: {
    'subject': 'GM PARTS - Detalles de tu servicio',
    'body': widget.link,
  },
);
await launchUrl(emailUri);
```

**Copiar:**
```dart
await Clipboard.setData(ClipboardData(text: widget.link));
```

Opcional: agregar botón "Abrir en navegador" que haga `launchURL(widget.link)`.

### 5. Reemplazar las 3 URLs hardcodeadas restantes

Buscar y reemplazar en toda la app:

| Archivo | URL actual | Nueva acción |
|---------|-----------|-------------|
| `f_recepcion_guardada_widget.dart:136` | `https://gmpartsprueba.flutterflow.app/gLinkcliente?id=` | Reemplazar por llamado a `generateLink(id, 'quote')` + abrir `EnvioclienteWidget` |
| `b_dash_board_diagnostico_widget.dart:268` | `https://gmpartsprueba.flutterflow.app/gLinkcliente?id=` | Ídem |
| `d_cotizacion_widget.dart:151` | `https://gmpartsprueba.flutterflow.app/gLinkclienteCotizacion?id=` | Ídem |

### 6. (Opcional) Implementar sendEmail en Flutter

Actualmente el email usa `mailto:`. Para envío real con Resend:

```dart
Future<void> sendEmail(String to, String subject, String body, String url) async {
  final functions = FirebaseFunctions.instanceFor(region: 'us-central1');
  await functions.httpsCallable('sendEmail').call({
    'to': to,
    'subject': subject,
    'body': body,
    'url': url,
  });
}
```

Llamar cuando el usuario presione "Correo" en `EnvioclienteWidget`, obteniendo el correo del documento `recepcionesRecord.correoElectronico`.

---

## Resumen visual del flujo corregido

```
Técnico presiona "Enviar cotización"
  → generateLink(29668, 'quote')
  → Firebase guarda quote_access_key = uuid
  → Retorna "https://gmparts-aprobaciones.vercel.app/cotizacion?key=uuid"
  → Abre modal EnvioclienteWidget con esa URL
  → Técnico comparte por WhatsApp/email/copiar
  → Cliente abre link en el navegador
  → Web valida key, muestra cotización, cliente aprueba
  → Firestore actualiza aprobacion_cotizacion = true
  → App Flutter detecta el cambio al leer Firestore
```

## Dependencias

Ya están en pubspec.yaml:
- `cloud_functions: 5.5.2` (no se usa actualmente, agregar import)
- `url_launcher: 6.3.1`
- `share_plus: ^7.0.0`

## Verificación

1. Probar flujo cotización: app → generar link → compartir → abrir en navegador → aprobar → verificar Firestore
2. Probar flujo conformidad: app → generar link → compartir → abrir → llenar encuesta → enviar → verificar Firestore
3. Verificar que las antiguas URLs a FlutterFlow ya no existen en el código
