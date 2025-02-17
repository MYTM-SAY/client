import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const BioSection = () => {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="shortBio">Short Bio</Label>
        <Input
          id="shortBio"
          placeholder="Enter a brief description (max 160 characters)"
          className="max-w-md"
          maxLength={160}
        />
        <p className="text-sm text-muted-foreground">
          A short description that appears in previews
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="fullBio">Full Bio</Label>
        <Textarea
          id="fullBio"
          placeholder="Tell us more about your community..."
          className="min-h-[200px]"
        />
        <p className="text-sm text-muted-foreground">
          Markdown formatting is supported
        </p>
      </div>
    </div>
  );
};
