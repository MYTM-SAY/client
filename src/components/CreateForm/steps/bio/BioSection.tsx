import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface BioSectionProps {
  bio: string
  description: string
  onChange: (bio: string, description: string) => void
}

export const BioSection = ({ bio, description, onChange }: BioSectionProps) => {
  const handleBioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value, description) // Changed from 'bio' to 'about' to maintain correct order
  }

  const handleAboutChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Changed event type
    onChange(bio, e.target.value) // Changed order to match the onChange parameter order
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="shortBio">Bio</Label>
        <Input
          id="shortBio"
          placeholder="Enter a brief description (max 160 characters)"
          className="max-w-md"
          maxLength={160}
          value={bio}
          onChange={handleBioChange}
        />
        <p className="text-sm text-muted-foreground">
          A short description that appears in previews
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="fullBio">Description</Label>
        <Textarea
          id="fullBio"
          placeholder="Tell us more about your community..."
          className="min-h-[200px]"
          value={description}
          onChange={handleAboutChange}
        />
        <p className="text-sm text-muted-foreground">
          Markdown formatting is supported
        </p>
      </div>
    </div>
  )
}
