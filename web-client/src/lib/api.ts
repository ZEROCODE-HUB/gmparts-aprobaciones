import type {
  ValidateKeyResponse,
  ApproveQuoteResponse,
  ApproveReportResponse,
  SurveyData,
} from './types'

const FUNCTIONS_BASE = process.env.NEXT_PUBLIC_FUNCTIONS_BASE || 'http://127.0.0.1:5001/gmparts/us-central1'

async function callFunction<T>(name: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(`${FUNCTIONS_BASE}/${name}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Function ${name} failed: ${res.status} ${text}`)
  }
  return res.json()
}

export async function validateKey(key: string, purpose: 'quote' | 'report'): Promise<ValidateKeyResponse> {
  return callFunction<ValidateKeyResponse>('validateKey', { key, purpose })
}

export async function approveQuote(key: string): Promise<ApproveQuoteResponse> {
  return callFunction<ApproveQuoteResponse>('approveQuote', { key })
}

export async function approveReport(key: string, survey: SurveyData): Promise<ApproveReportResponse> {
  return callFunction<ApproveReportResponse>('approveReport', { key, survey })
}
