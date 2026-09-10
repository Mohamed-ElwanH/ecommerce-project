//pulls the message out of the shapes the API returns for errors
//("string" body or { error: string })
export function getApiError(err: any): string {
  if (typeof err?.error === 'string') return err.error;
  return err?.error?.error || 'Something went wrong';
}
