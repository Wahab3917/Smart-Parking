import "@/App.css"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader2, UploadCloud, Car, MapPin, Zap, CheckCircle } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"

function App() {
  const [selectedImage, setSelectedImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [resultImage, setResultImage] = useState("")
  const [dragActive, setDragActive] = useState(false)

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleDetect = async () => {
    if (!selectedImage) return

    setLoading(true)

    const formData = new FormData()
    formData.append("image", selectedImage)

    try {
      const response = await fetch("http://localhost:5000/detect", {
        method: "POST",
        body: formData,
      })
      const data = await response.json()
      setResultImage(`http://localhost:5000/${data.result}`)
    } catch (error) {
      console.error("Detection failed", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex flex-col overflow-hidden">
      <div className="flex-grow container mx-auto max-w-4xl p-4">
        
        {/* Header */}
        <header className="text-center mb-16 pt-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">Smart Parking</h1>
          </div>
          <p className="text-white/90 text-lg font-medium">AI-Powered Parking Spot Detection with YOLOv5</p>
        </header>

        <div className="grid md:grid-cols-2 gap-6 items-stretch">
          {/* Upload Section */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl h-full">
              <CardContent className="p-6 h-full flex flex-col">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <UploadCloud className="w-6 h-6" />
                  Upload Image
                </h2>

                <div className="flex-grow flex flex-col">
                  {/* Drag & Drop Area */}
                  <div
                    className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                      dragActive
                        ? "border-yellow-300 bg-yellow-400/20"
                        : "border-white/30 hover:border-white/50 hover:bg-white/5"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />

                    <div className="space-y-4">
                      <div className="mx-auto w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                        <UploadCloud className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-semibold text-lg">Drop your image here</p>
                        <p className="text-white/70">or click to browse</p>
                      </div>
                    </div>
                  </div>

                  {/* Image Preview */}
                  <AnimatePresence>
                    {previewUrl && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="mt-6"
                      >
                        <div className="relative rounded-xl overflow-hidden shadow-lg">
                          <img
                            src={previewUrl || "/placeholder.svg"}
                            alt="Preview"
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute top-2 right-2">
                            <div className="bg-green-500 text-white px-2 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                              <CheckCircle className="w-4 h-4" />
                              Ready
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Detect Button */}
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="mt-auto pt-6">
                    <Button
                      onClick={handleDetect}
                      disabled={!selectedImage || loading}
                      className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="animate-spin mr-2 w-5 h-5" />
                          Detecting Spots...
                        </>
                      ) : (
                        <>
                          <Zap className="mr-2 w-5 h-5" />
                          Detect Parking Spots
                        </>
                      )}
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Results Section */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl h-full">
              <CardContent className="p-6 h-full flex flex-col">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <MapPin className="w-6 h-6" />
                  Detection Results
                </h2>

                <div className="flex-grow flex flex-col justify-center">
                  <AnimatePresence>
                    {loading && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center py-12 space-y-4"
                      >
                        <div className="relative">
                          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <Car className="absolute inset-0 m-auto w-6 h-6 text-white" />
                        </div>
                        <p className="text-white font-medium">AI is analyzing your image...</p>
                      </motion.div>
                    )}

                    {resultImage && !loading && (
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                        <div className="relative rounded-xl overflow-hidden shadow-lg">
                          <img
                            src={resultImage || "/placeholder.svg"}
                            alt="Detection Result"
                            className="w-full h-64 object-cover"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                            <p className="text-white font-semibold">🎯 Parking spots detected successfully!</p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {!resultImage && !loading && (
                      <div className="flex flex-col items-center justify-center py-12 space-y-4 text-white/60">
                        <div className="w-16 h-16 border-2 border-dashed border-white/30 rounded-full flex items-center justify-center">
                          <MapPin className="w-6 h-6" />
                        </div>
                        <p className="text-center">Upload an image to see results</p>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center mt-16 px-4 pb-8"
      >
        <p className="text-white/70">Powered by YOLOv5 Computer Vision • Built with ❤️ by Billi Gang</p>
      </motion.footer>
    </div>
  )
}

export default App;