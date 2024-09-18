"use client"
import { useState } from 'react'
import { Upload, Send, RefreshCw } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Component() {
  const [image, setImage] = useState<string | null>(null)
  const [solution, setSolution] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSolve = async () => {
    if (!image) return

    setLoading(true)
    try {
      console.log('Gönderilen resim:', image.substring(0, 100)); // İlk 100 karakteri göster
      const response = await fetch('http://localhost:10000/solve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: image.split(',')[1] }),
      })

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API isteği başarısız: ${errorData.error}, Detaylar: ${errorData.details}`);
      }

      const data = await response.json()
      setSolution(data.solution)
    } catch (error: any) {
      console.error('Hata çözülürken:', error)
      setSolution('Problemi çözerken bir hata oluştu: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setImage(null)
    setSolution(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-indigo-700">Math Solver</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="image-upload" className="text-sm font-medium text-gray-700">
              Matematik Sorusu Resmi
            </Label>
            <div className="flex items-center space-x-2">
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button
                onClick={() => document.getElementById('image-upload')?.click()}
                variant="outline"
                className="w-full"
              >
                <Upload className="mr-2 h-4 w-4" /> Resim Yükle
              </Button>
            </div>
          </div>
          {image && (
            <div className="mt-4">
              <img src={image} alt="Yüklenen soru" className="w-full h-auto rounded-lg shadow-md" />
            </div>
          )}
          {solution && (
            <div className="mt-4 p-4 bg-green-100 rounded-lg">
              <p className="text-green-800 font-medium">{solution}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={handleReset} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" /> Sıfırla
          </Button>
          <Button onClick={handleSolve} disabled={!image || loading}>
            {loading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Çözülüyor...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" /> Çöz
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
