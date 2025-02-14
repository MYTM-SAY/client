import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import CommunityCard from "@/components/CommunityCard";

const pages = () => {
  return (
    <div className="p-4 overflow-y-auto no-scrollbar w-full mx-auto max-w-[1000px]">
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Pending</AccordionTrigger>
          <AccordionContent className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-2">
            <CommunityCard />
            <CommunityCard />
            <CommunityCard />
            <CommunityCard />
            <CommunityCard />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Favorite</AccordionTrigger>
          <AccordionContent className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-2">
            <CommunityCard />
            <CommunityCard />
            <CommunityCard />
            <CommunityCard />
            <CommunityCard />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>All</AccordionTrigger>
          <AccordionContent className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-2">
            <CommunityCard />
            <CommunityCard />
            <CommunityCard />
            <CommunityCard />
            <CommunityCard />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default pages;
