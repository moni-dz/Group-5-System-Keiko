"use client";

import { useEffect, useState } from "react";
import Flashcard, { FlashcardProps, cardMaxWidth } from "@/components/flashcard";
import { CardData, getAllCards, getAvailableTags } from "@/lib/flashcard-api";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface Tag {
  value: string;
  label: string;
}

export default function ReviewPage() {
  const [cards, setCards] = useState<CardData[]>([]);
  const [selectedTag, setSelectedTag] = useState("");

  useEffect(() => {
    getAllCards().then((data: CardData[]) => setCards(data));
  }, []);

  return (
    <>
      <div className="bg-gray-50 min-h-screen">
        <div className="flex flex-col items-center justify-center -mb-40">
          <h1 className="text-3xl font-bold mb-8 mt-10">Flashcards</h1>
          <div className="space-y-4">
            <div className="flex gap-5">
              <Button className="w-64" asChild>
                <a href="/">Go Back</a>
              </Button>
              <TagsCombobox selectedTag={selectedTag} setSelectedTag={setSelectedTag} />
            </div>
          </div>
        </div>
        <div className="p-4 flex items-center justify-center min-h-screen">
          <div
            className="flex flex-wrap justify-center gap-4"
            style={{
              maxWidth: cardMaxWidth(cards.length),
            }}
          >
            {selectedTag === ""
              ? cards.map((card: FlashcardProps) => <Flashcard key={card.id} {...card} />)
              : cards
                  .filter((card: FlashcardProps) => card.tags.includes(selectedTag))
                  .map((card: FlashcardProps) => <Flashcard key={card.id} {...card} />)}
          </div>
        </div>
      </div>
    </>
  );
}

interface TagsComboboxProps {
  selectedTag: string;
  setSelectedTag: (tag: string) => void;
}

function TagsCombobox(props: TagsComboboxProps) {
  const [open, setOpen] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const { selectedTag, setSelectedTag } = props;

  useEffect(() => {
    getAvailableTags().then((data) => {
      setTags(data.map((tag) => ({ value: tag, label: tag })));
    });
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
          {selectedTag ? tags.find((tag) => tag.value === selectedTag)?.label : "Select tag..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search tags..." />
          <CommandList>
            <CommandEmpty>No tag found.</CommandEmpty>
            <CommandGroup>
              {tags.map((tag: Tag) => (
                <CommandItem
                  key={tag.value}
                  value={tag.value}
                  onSelect={(currentValue) => {
                    setSelectedTag(currentValue === selectedTag ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", selectedTag === tag.value ? "opacity-100" : "opacity-0")} />
                  {tag.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
