import { getFunctions, httpsCallable } from 'firebase/functions'
import app from './firebase'
import type {
  ValidateKeyResponse,
  ApproveQuoteResponse,
  ApproveReportResponse,
  SurveyData,
} from './types'

const functions = getFunctions(app, 'us-central1')

export async function validateKey(key: string, purpose: 'quote' | 'report'): Promise<ValidateKeyResponse> {
  const call = httpsCallable<{ key: string; purpose: string }, ValidateKeyResponse>(functions, 'validateKey')
  const { data } = await call({ key, purpose })
  return data
}

export async function approveQuote(key: string): Promise<ApproveQuoteResponse> {
  const call = httpsCallable<{ key: string }, ApproveQuoteResponse>(functions, 'approveQuote')
  const { data } = await call({ key })
  return data
}

export async function approveReport(key: string, survey: SurveyData): Promise<ApproveReportResponse> {
  const call = httpsCallable<{ key: string; survey: SurveyData }, ApproveReportResponse>(functions, 'approveReport')
  const { data } = await call({ key, survey })
  return data
}
