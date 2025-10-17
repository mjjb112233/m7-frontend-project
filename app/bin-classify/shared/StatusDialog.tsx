import React from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertCircle, XCircle } from "lucide-react"

interface StatusDialogProps {
  isOpen: boolean
  onClose: () => void
  type: "success" | "error" | "warning"
  title: string
  message: string
  onConfirm?: () => void
}

export function StatusDialog({ 
  isOpen, 
  onClose, 
  type, 
  title, 
  message, 
  onConfirm 
}: StatusDialogProps) {
  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-6 w-6 text-green-600" />
      case "error":
        return <XCircle className="h-6 w-6 text-red-600" />
      case "warning":
        return <AlertCircle className="h-6 w-6 text-yellow-600" />
      default:
        return null
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getIcon()}
            {title}
          </DialogTitle>
          <DialogDescription>
            {message}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            关闭
          </Button>
          {onConfirm && (
            <Button onClick={onConfirm}>
              确认
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
