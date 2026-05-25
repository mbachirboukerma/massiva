import { Bot, User } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  role: "user" | "ai";
  children: React.ReactNode;
}

export function ChatBubble({ role, children }: Props) {
  if (role === "user") {
    return (
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="ms-auto flex max-w-[85%] items-end gap-2">
        <div className="rounded-2xl rounded-br-sm bg-[image:var(--grad-primary)] px-4 py-2.5 text-sm text-primary-foreground shadow-soft">
          {children}
        </div>
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border bg-card text-muted-foreground">
          <User className="h-4 w-4" />
        </span>
      </motion.div>
    );
  }
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex max-w-[90%] items-start gap-2">
      <span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[image:var(--grad-primary)] text-primary-foreground">
        <Bot className="h-4 w-4" />
      </span>
      <div className="rounded-2xl rounded-bl-sm border bg-card px-4 py-2.5 text-sm text-foreground shadow-soft">
        {children}
      </div>
    </motion.div>
  );
}
