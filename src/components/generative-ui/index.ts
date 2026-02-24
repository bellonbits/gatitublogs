import type { TamboComponent } from '@tambo-ai/react';
import { z } from 'zod';
import Graph from './Graph';
import { InteractableNote } from './Note';

export const tamboComponents: TamboComponent[] = [
    {
        name: "Graph",
        description: "Displays data as charts (bar or line) using the Recharts library.",
        component: Graph,
        propsSchema: z.object({
            data: z.array(z.object({ name: z.string(), value: z.number() })),
            type: z.enum(["line", "bar"]),
        }),
    },
    {
        name: "Note",
        description: "A persistent note for tracking tasks, ideas, or summaries.",
        component: InteractableNote,
        propsSchema: z.object({
            title: z.string(),
            content: z.string(),
            color: z.enum(["white", "yellow", "blue", "green"]).optional(),
        }),
    },
];

export { Graph, InteractableNote };
