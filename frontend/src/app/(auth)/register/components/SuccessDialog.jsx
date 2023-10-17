'use client'

import PropTypes from 'prop-types'

import { useRouter } from 'next/navigation'

import { Copy } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

SuccessDialog.propTypes = {
  apiKey: PropTypes.string,
  isOpen: PropTypes.bool,
  onOpenChange: PropTypes.func.isRequired,
}

export function SuccessDialog({ apiKey, isOpen, onOpenChange }) {
  const copyToClipboard = () => {
    const copyText = document.getElementById('key')

    copyText.select()
    copyText.setSelectionRange(0, 99999)

    document.execCommand('copy')
  }

  const router = useRouter()

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Your API Key</DialogTitle>
          <DialogDescription>
            You will only be able to copy this key once.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="key" className="sr-only">
              API Key
            </Label>
            <Input id="key" defaultValue={apiKey} readOnly />
          </div>
          <Button
            onClick={() => copyToClipboard()}
            size="sm"
            className="bg-blue-600 px-3"
          >
            <span className="sr-only">Copy</span>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push('/dashboard')}
            >
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
