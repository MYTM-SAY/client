import React from "react";
import { Button } from "../ui/button";
import { RiShareForwardLine } from "react-icons/ri";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaWhatsapp,
  FaTelegram,
} from "react-icons/fa";
import { MdContentCopy } from "react-icons/md";
import { useToast } from "@/hooks/use-toast";
import { ShareButtonProps } from "@/types";

const PostShare = ({
  url = window.location.href,
  title = "Check this out!",
}: ShareButtonProps) => {
  const { toast } = useToast();

  const socialMediaLinks = [
    {
      name: "Facebook",
      icon: <FaFacebook className="w-6 h-6" />,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        url
      )}`,
      color: "hover:bg-blue-600/10 hover:text-blue-600",
    },
    {
      name: "Twitter",
      icon: <FaTwitter className="w-6 h-6" />,
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        url
      )}&text=${encodeURIComponent(title)}`,
      color: "hover:bg-blue-400/10 hover:text-blue-400",
    },
    {
      name: "LinkedIn",
      icon: <FaLinkedin className="w-6 h-6" />,
      href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
        url
      )}&title=${encodeURIComponent(title)}`,
      color: "hover:bg-blue-700/10 hover:text-blue-700",
    },
    {
      name: "WhatsApp",
      icon: <FaWhatsapp className="w-6 h-6" />,
      href: `https://wa.me/?text=${encodeURIComponent(title + " " + url)}`,
      color: "hover:bg-green-500/10 hover:text-green-500",
    },
    {
      name: "Telegram",
      icon: <FaTelegram className="w-6 h-6" />,
      href: `https://t.me/share/url?url=${encodeURIComponent(
        url
      )}&text=${encodeURIComponent(title)}`,
      color: "hover:bg-blue-500/10 hover:text-blue-500",
    },
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link copied to clipboard!",
        variant: "success",
        duration: 2000,
      });
    } catch (err) {
      toast({
        title: "Failed to copy link",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  return (
    <Drawer>
      <DrawerTrigger asChild className="hover:!bg-accent hover:text-white">
        <Button className="flex items-center gap-2 px-4 py-2 text-foreground bg-card hover:bg-card/80">
          <RiShareForwardLine className="!w-6 !h-6" />
          Share
        </Button>
      </DrawerTrigger>
      {/* Add mx-auto to center the drawer on all screens */}
      <DrawerContent className="max-w-md mx-auto">
        <div className="flex flex-col items-center justify-center w-full">
          <DrawerHeader>
            <DrawerTitle className="text-xl font-semibold text-center">
              Share via
            </DrawerTitle>
          </DrawerHeader>
          <div className="py-8 px-2 w-full max-w-sm mx-auto">
            {/* Added max-w-sm and mx-auto */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {socialMediaLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex flex-col items-center justify-center p-4 rounded-lg bg-card border border-border transition-all ${social.color}`}
                >
                  {social.icon}
                  <span className="mt-2 text-sm font-medium">
                    {social.name}
                  </span>
                </a>
              ))}
            </div>
            <div className="flex items-center gap-3 h-10 pl-4 bg-muted rounded-lg">
              <div className="flex-1 truncate text-sm text-muted-foreground">
                {url}
              </div>
              <Button
                onClick={copyToClipboard}
                className="shrink-0 h-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-md px-4 flex items-center gap-2 transition-all hover:scale-105"
                size="sm"
              >
                <MdContentCopy className="w-4 h-4" />
                <span className="font-medium">Copy</span>
              </Button>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default PostShare;
