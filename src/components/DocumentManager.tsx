import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { FileText, Upload, Download, Trash2, File, Image, FileSpreadsheet } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Document {
  id: string;
  name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  created_at: string;
}

interface DocumentManagerProps {
  moveId?: string;
}

const fileIcons: Record<string, React.ReactNode> = {
  pdf: <FileText className="w-8 h-8 text-red-500" />,
  doc: <FileText className="w-8 h-8 text-blue-500" />,
  docx: <FileText className="w-8 h-8 text-blue-500" />,
  xls: <FileSpreadsheet className="w-8 h-8 text-green-500" />,
  xlsx: <FileSpreadsheet className="w-8 h-8 text-green-500" />,
  jpg: <Image className="w-8 h-8 text-purple-500" />,
  jpeg: <Image className="w-8 h-8 text-purple-500" />,
  png: <Image className="w-8 h-8 text-purple-500" />,
  default: <File className="w-8 h-8 text-muted-foreground" />,
};

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export default function DocumentManager({ moveId }: DocumentManagerProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    let query = supabase
      .from("documents")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (moveId) {
      query = query.eq("move_id", moveId);
    }

    const { data } = await query;
    if (data) {
      setDocuments(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDocuments();
  }, [moveId]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Bitte melden Sie sich an");
        return;
      }

      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { error: insertError } = await supabase.from("documents").insert({
        user_id: user.id,
        move_id: moveId || null,
        name: file.name,
        file_path: filePath,
        file_type: fileExt || "unknown",
        file_size: file.size,
      });

      if (insertError) throw insertError;

      toast.success("Dokument erfolgreich hochgeladen");
      fetchDocuments();
    } catch (error) {
      toast.error("Fehler beim Hochladen");
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (doc: Document) => {
    try {
      const { data, error } = await supabase.storage
        .from("documents")
        .download(doc.file_path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = doc.name;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("Fehler beim Herunterladen");
    }
  };

  const handleDelete = async (doc: Document) => {
    try {
      await supabase.storage.from("documents").remove([doc.file_path]);
      await supabase.from("documents").delete().eq("id", doc.id);
      toast.success("Dokument gelöscht");
      fetchDocuments();
    } catch (error) {
      toast.error("Fehler beim Löschen");
    }
  };

  const getFileIcon = (type: string) => {
    return fileIcons[type.toLowerCase()] || fileIcons.default;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Dokumente
          </CardTitle>
          <div className="relative">
            <Input
              type="file"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleUpload}
              disabled={uploading}
            />
            <Button disabled={uploading} size="sm">
              <Upload className="w-4 h-4 mr-2" />
              {uploading ? "Lädt..." : "Hochladen"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">
            Lade Dokumente...
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Keine Dokumente vorhanden</p>
            <p className="text-sm">Laden Sie Ihre Umzugsdokumente hoch</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {documents.map((doc) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  {getFileIcon(doc.file_type)}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{doc.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(doc.file_size)} •{" "}
                      {new Date(doc.created_at).toLocaleDateString("de-CH")}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDownload(doc)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(doc)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </CardContent>
    </Card>
  );
}