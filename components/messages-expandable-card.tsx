"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/use-outside-click";

interface MessageCard {
  id: string;
  userId: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  lastMessageTime: string | Date;
  unreadCount: number;
  type: string;
  description?: string;
  content?: () => React.ReactNode | React.ReactNode;
}

interface MessagesExpandableCardProps {
  messages: MessageCard[];
}

export function MessagesExpandableCard({ messages }: MessagesExpandableCardProps) {
  const [active, setActive] = useState<MessageCard | boolean | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  const formatTime = (time: string | Date) => {
    const date = new Date(time);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours === 1) return '1 hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;
    return date.toLocaleDateString();
  };

  return (
    <>
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0 grid place-items-center z-[100]">
            <motion.button
              key={`button-${active.name}-${id}`}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.05 } }}
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white dark:bg-neutral-900 rounded-full h-6 w-6"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>

            <motion.div
              layoutId={`card-${active.id}-${id}`}
              ref={ref}
              className="w-full max-w-[500px] h-full md:h-fit md:max-h-[90%] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden"
            >
              <motion.div layoutId={`image-${active.id}-${id}`}>
                <img
                  width={200}
                  height={200}
                  src={active.avatar || '/placeholder-user.jpg'}
                  alt={active.name}
                  className="w-full h-80 lg:h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-cover"
                />
              </motion.div>

              <div>
                <div className="flex justify-between items-start p-4">
                  <div>
                    <motion.h3
                      layoutId={`title-${active.id}-${id}`}
                      className="font-bold text-neutral-700 dark:text-neutral-200"
                    >
                      {active.name}
                    </motion.h3>
                    <motion.p
                      layoutId={`time-${active.id}-${id}`}
                      className="text-neutral-600 dark:text-neutral-400 text-sm"
                    >
                      {formatTime(active.lastMessageTime)}
                    </motion.p>
                  </div>
                  {active.unreadCount > 0 && (
                    <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold">
                      {active.unreadCount}
                    </div>
                  )}
                </div>
                
                <div className="pt-4 relative px-4">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-neutral-600 text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 flex flex-col items-start gap-4 overflow-auto dark:text-neutral-400 [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
                  >
                    {typeof active.content === "function"
                      ? active.content()
                      : (
                        <p className="text-neutral-600 dark:text-neutral-400">
                          {active.lastMessage || "No messages yet"}
                        </p>
                      )}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      <ul className="max-w-2xl mx-auto w-full gap-4">
        {messages.map((message) => (
          <motion.div
            layoutId={`card-${message.id}-${id}`}
            key={`card-${message.id}-${id}`}
            onClick={() => setActive(message)}
            className="p-4 flex flex-col md:flex-row justify-between items-center hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer"
          >
            <div className="flex gap-4 flex-col md:flex-row">
              <motion.div layoutId={`image-${message.id}-${id}`}>
                <img
                  width={100}
                  height={100}
                  src={message.avatar || '/placeholder-user.jpg'}
                  alt={message.name}
                  className="h-40 w-40 md:h-14 md:w-14 rounded-lg object-cover"
                />
              </motion.div>
              <div>
                <motion.h3
                  layoutId={`title-${message.id}-${id}`}
                  className="font-medium text-neutral-800 dark:text-neutral-200 text-center md:text-left"
                >
                  {message.name}
                </motion.h3>
                <motion.p
                  layoutId={`time-${message.id}-${id}`}
                  className="text-neutral-600 dark:text-neutral-400 text-center md:text-left text-sm"
                >
                  {formatTime(message.lastMessageTime)}
                </motion.p>
              </div>
            </div>
            <motion.button
              layoutId={`unread-${message.id}-${id}`}
              className={`px-4 py-2 text-sm rounded-full font-bold ${
                message.unreadCount > 0
                  ? "bg-primary hover:bg-primary/90 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-black mt-4 md:mt-0"
              }`}
            >
              {message.unreadCount > 0 ? `${message.unreadCount} new` : "View"}
            </motion.button>
          </motion.div>
        ))}
      </ul>
    </>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.05 } }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black dark:text-white"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};




