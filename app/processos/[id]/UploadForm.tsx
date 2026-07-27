'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function UploadForm({ processoId }: { processoId: string }) {
  const [uploading, setUploading] = useState(false)
  const router = useRouter()

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const fileInput = e.currentTarget.querySelector('input[type="file"]') as HTMLInputElement
    if (!fileInput.files || fileInput.files.length === 0) {
      alert('Selecione um arquivo')
      return
    }

    setUploading(true)
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        alert('Arquivo enviado com sucesso!')
        router.refresh()
        fileInput.value = ''
      } else {
        alert('Erro ao enviar arquivo')
      }
    } catch (error) {
      alert('Erro ao enviar arquivo')
    } finally {
      setUploading(false)
    }
  }

  return (
    <form onSubmit={handleUpload} className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
      <input type="hidden" name="processoId" value={processoId} />
      
      <div className="space-y-3">
        <p className="text-gray-500">Arraste arquivos ou clique para selecionar</p>
        <input 
          type="file" 
          name="file"
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <button type="submit" disabled={uploading}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400">
          {uploading ? 'Enviando...' : '📤 Enviar Arquivo'}
        </button>
      </div>
    </form>
  )
}