# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/main/packages/create-svelte).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm create svelte@latest

# create a new project in my-app
npm create svelte@latest my-app
```
## Adding Shadcn-Svelte
to add [shadcn-svelte](https://www.shadcn-svelte.com/) components and CLI to the project follow this [guide](https://www.shadcn-svelte.com/docs/installation/sveltekit)
commands summary:

```bash
# add tailwind
npx svelte-add@latest tailwindcss
npm install
```
Setup path aliases: ***(If you are not using the default alias $lib, you'll need to update your svelte.config.js file to include those aliases.)***
```js
const config = {
 // ... other config
 kit: {
  // ... other config
  alias: {
   "@/*": "./path/to/lib/*",
  },
 },
};
```
Run the CLI
```bash
npx shadcn-svelte@latest init
```
Finally use the CLI to add shadcn components to the project
```bash
# add button
npx shadcn-svelte@latest add button
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
