# Prompt de actualización: cambios adicionales en app Flutter

## Ejecutar DESPUÉS del prompt principal (PROMPT_INTEGRACION_MOVIL.md)

---

### 1. Asegurar que Firestore tenga estos campos adicionales

La web ahora lee y muestra estos campos. Verificar que existan en el documento `recepciones/{id}` al guardar desde Flutter:

```dart
// Al crear/actualizar una recepción, incluir:
final data = {
  'anio': anioController.text,                    // Año del vehículo
  'nivelCombustible': nivelCombustibleController.text, // ej: "50%"
  'inventario': inventarioController.text,         // ej: "Extintor"
  'observaciones': observacionesController.text,   // Observaciones adicionales
  'tecnicoServicio': tecnicoServicio,             // Nombre del técnico
  'tipoServicio': tipoServicio,                   // "Preventivo" / "Correctivo"
  'motivoIngreso': motivoIngresoController.text,   // Motivo de ingreso
  'fotos': fotosList,                              // Lista de URLs de fotos generales
};
```

Si algún campo no existe en el formulario actual, agregarlo.

### 2. Reemplazar URL en `f_recepcion_guardada_widget.dart` y `b_dash_board_diagnostico_widget.dart`

Ambos usan `https://gmpartsprueba.flutterflow.app/gLinkcliente?id=`. Reemplazar por:

```dart
final url = await generateLink(widget.id!, 'quote');
// Usar url en el EnvioclienteWidget o launchURL
```

### 3. Reemplazar URL en `d_cotizacion_widget.dart`

Usa `https://gmpartsprueba.flutterflow.app/gLinkclienteCotizacion?id=`. Reemplazar por:

```dart
final url = await generateLink(widget.id!, 'quote');
```

### 4. Verificar que no queden URLs hardcodeadas

Buscar en todo el proyecto:

```
gmpartsprueba.flutterflow.app
```

Si aparecen más archivos además de los listados, reemplazar igualmente.

---

## Resumen de campos que la web cliente espera

| Campo Firestore | Sección en web | Tipo |
|----------------|----------------|------|
| `anio` | Datos del vehículo - Año | string |
| `nivelCombustible` | Datos del vehículo - Nivel de combustible | string |
| `inventario` | Datos del vehículo - Inventario | string |
| `observaciones` | Datos del vehículo - Observaciones adicionales | string |
| `tecnicoServicio` | Problema técnico - Técnico de servicio | string |
| `tipoServicio` | Problema técnico - Tipo de servicio | string |
| `motivoIngreso` | Problema técnico - Motivo de ingreso | string |
| `fotos` | Problema técnico - Fotos | string[] |

El resto de campos (`nombreCliente`, `placa`, `marca`, `modelo`, `subtotal`, etc.) ya deberían existir.
