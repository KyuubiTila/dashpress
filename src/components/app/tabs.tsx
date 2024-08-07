import type { ReactNode } from "react";
import { useState, useEffect } from "react";
import { sluggify } from "shared/lib/strings";
import type { MessageDescriptor } from "@lingui/core";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { useLingui } from "@lingui/react";
import { cn } from "@/lib/utils";
import { TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ScrollArea } from "../ui/scroll-area";

interface IProps {
  contents: {
    label: MessageDescriptor;
    id: string;
    content: ReactNode;
    muted?: boolean;
  }[];
  currentTab?: string;
  onChange?: (tab: string) => void;
}

export function Tabs({ contents, currentTab, onChange }: IProps) {
  const { _ } = useLingui();

  const [activeTab, setActiveTab$1] = useState<string>(
    sluggify(currentTab || _(contents[0].id))
  );

  const setActiveTab = (id: string) => {
    setActiveTab$1(id);
  };

  useEffect(() => {
    if (currentTab) {
      setActiveTab(currentTab);
    } else {
      setActiveTab(_(contents[0].id));
    }
  }, [currentTab, JSON.stringify(contents.map((content) => content.id))]);

  const changeTab = (tabId: string | null) => {
    if (!tabId) {
      return;
    }
    if (activeTab !== tabId) {
      setActiveTab(tabId);
      onChange?.(tabId);
    }
  };

  return (
    <TabsPrimitive.Root
      defaultValue={activeTab}
      value={activeTab}
      onValueChange={changeTab}
    >
      <ScrollArea orientation="horizontal">
        <TabsList className="mb-1">
          {contents.map(({ label, id, muted }) => (
            <TabsTrigger
              value={id}
              key={id}
              className={cn({ "!text-muted": muted })}
            >
              {_(label)}
            </TabsTrigger>
          ))}
        </TabsList>
      </ScrollArea>
      {contents.map(({ id, content }) => (
        <TabsContent key={id} value={id}>
          {content}
        </TabsContent>
      ))}
    </TabsPrimitive.Root>
  );
}
