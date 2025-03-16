import React from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import JoinedCommunityCard from '@/components/HomePage/CommunityCardImproved'

const pages = () => {
  const ar = [1, 2, 3, 4, 5, 6, 7, 8]

  return (
    <div className="overflow-y-auto no-scrollbar w-full mx-auto max-w-[1000px]">
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className="h4">Pending</AccordionTrigger>
          <AccordionContent className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5">
            {ar.map((_, idx) => (
              <JoinedCommunityCard key={idx} />
            ))}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger className="h4">Favorite</AccordionTrigger>
          <AccordionContent className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5">
            {ar.map((_, idx) => (
              <JoinedCommunityCard key={idx} />
            ))}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger className="h4">All</AccordionTrigger>
          <AccordionContent className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5">
            {ar.map((_, idx) => (
              <JoinedCommunityCard key={idx} />
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

export default pages
