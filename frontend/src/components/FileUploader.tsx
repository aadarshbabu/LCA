
import { useState } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';

interface FileUploaderProps {
  bucketName: string;
  onUploadComplete: (url: string) => void;
  accept?: string;
}

const FileUploader = ({ bucketName, onUploadComplete, accept = '*' }: FileUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      setProgress(0);
      
      const file = event.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const filePath = `${Math.random()}.${fileExt}`;

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Update progress after upload completes
      setProgress(100);

      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      onUploadComplete(publicUrl);
    } catch (error: any) {
      console.error('Error uploading file:', error.message);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Button variant="outline" className="w-full h-32 relative">
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={uploadFile}
          accept={accept}
          disabled={uploading}
        />
        <div className="flex flex-col items-center gap-2">
          <Upload className="h-8 w-8" />
          <span>{uploading ? 'Uploading...' : 'Click or drag to upload'}</span>
        </div>
      </Button>
      {uploading && <Progress value={progress} className="w-full" />}
    </div>
  );
};

export default FileUploader;
