import { z } from "zod";
import RecipeCard from "../components/RecipeCard";
import Graph from "../components/generative-ui/Graph";
import { InteractableNote } from "../components/generative-ui/Note";

export const tamboComponents = [
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
    {
        name: "RecipeCard",
        description: "A component that renders a recipe card",
        component: RecipeCard,
        propsSchema: z.object({
            title: z.string().describe("The title of the recipe"),
            description: z.string().describe("The description of the recipe"),
            prepTime: z.number().describe("The prep time of the recipe in minutes"),
            cookTime: z.number().describe("The cook time of the recipe in minutes"),
            originalServings: z
                .number()
                .describe("The original servings of the recipe"),
            ingredients: z
                .array(
                    z.object({
                        name: z.string().describe("The name of the ingredient"),
                        amount: z.number().describe("The amount of the ingredient"),
                        unit: z.string().describe("The unit of the ingredient"),
                    })
                )
                .describe("The ingredients of the recipe"),
        }),
    },
];

export const tamboTools = [
    {
        name: "get-available-ingredients",
        description:
            "Get a list of all the available ingredients that can be used in a recipe.",
        tool: () => [
            "pizza dough",
            "mozzarella cheese",
            "tomatoes",
            "basil",
            "olive oil",
            "chicken breast",
            "ground beef",
            "onions",
            "garlic",
            "bell peppers",
            "mushrooms",
            "pasta",
            "rice",
            "eggs",
            "bread",
        ],
        inputSchema: z.object({}),
        outputSchema: z.array(z.string()),
    },
];
