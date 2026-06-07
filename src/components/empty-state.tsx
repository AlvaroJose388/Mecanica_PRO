
'use client';

import { LucideIcon, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface EmptyStateProps {
  title: string;
  description: string;
  icon: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ title, description, icon: Icon, actionLabel, onAction }: EmptyStateProps) {
  return (
    <Card className="border-dashed border-2 bg-muted/20">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Icon className="h-10 w-10 text-primary/60" />
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-muted-foreground max-w-xs mb-6 text-sm">
          {description}
        </p>
        {actionLabel && onAction && (
          <Button onClick={onAction} className="shadow-lg">
            <Plus className="mr-2 h-4 w-4" />
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
