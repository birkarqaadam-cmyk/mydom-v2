import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { uploadImage, deleteImage } from '../lib/supabase';
import { toast } from 'sonner';

export const ImageDropzone = ({ images, onImagesChange, maxFiles = 5 }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (images.length + acceptedFiles.length > maxFiles) {
      toast.error(`Maksimum ${maxFiles} şəkil yükləyə bilərsiniz`);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const newImages = [];
    
    for (let i = 0; i < acceptedFiles.length; i++) {
      const file = acceptedFiles[i];
      try {
        const result = await uploadImage(file);
        newImages.push({
          filePath: result.filePath,
          publicUrl: result.publicUrl,
        });
        setUploadProgress(Math.round(((i + 1) / acceptedFiles.length) * 100));
      } catch (error) {
        console.error('Upload error:', error);
        toast.error(`${file.name} yüklənə bilmədi`);
      }
    }

    if (newImages.length > 0) {
      onImagesChange([...images, ...newImages]);
      toast.success(`${newImages.length} şəkil yükləndi`);
    }

    setIsUploading(false);
    setUploadProgress(0);
  }, [images, onImagesChange, maxFiles]);

  const removeImage = async (index) => {
    const image = images[index];
    try {
      await deleteImage(image.filePath);
      const newImages = images.filter((_, i) => i !== index);
      onImagesChange(newImages);
      toast.success('Şəkil silindi');
    } catch (error) {
      console.error('Delete error:', error);
      // Still remove from local state even if Supabase delete fails
      const newImages = images.filter((_, i) => i !== index);
      onImagesChange(newImages);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    maxFiles: maxFiles - images.length,
    disabled: isUploading || images.length >= maxFiles,
  });

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? 'active' : ''} ${
          isUploading || images.length >= maxFiles ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        data-testid="image-dropzone"
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center">
          {isUploading ? (
            <>
              <Loader2 size={48} className="text-[#B91C1C] animate-spin mb-4" />
              <p className="text-gray-600">Yüklənir... {uploadProgress}%</p>
            </>
          ) : (
            <>
              <Upload size={48} className="text-gray-400 mb-4" />
              <p className="text-gray-600 font-medium">
                {isDragActive ? 'Şəkilləri buraya buraxın' : 'Şəkilləri sürükləyib buraxın'}
              </p>
              <p className="text-sm text-gray-400 mt-2">
                və ya kliklə seçin (maksimum {maxFiles} şəkil)
              </p>
            </>
          )}
        </div>
      </div>

      {/* Progress bar */}
      {isUploading && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-[#B91C1C] h-2 rounded-full transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}

      {/* Image previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border">
              <img
                src={image.publicUrl}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={16} />
              </button>
              {index === 0 && (
                <span className="absolute bottom-2 left-2 px-2 py-1 bg-[#B91C1C] text-white text-xs rounded">
                  Əsas şəkil
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
