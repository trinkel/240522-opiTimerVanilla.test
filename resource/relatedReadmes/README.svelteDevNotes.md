# Development Notes

Notes from a Svelte install. Shoelace stuff may be applicable, but I'm not sure it was ever part of a timer stack.h

## Resources

- Web component library: [Shoelace](https://shoelace.style)

- Using Shoelace with Svelte: [Introducing Shoelace, a Framework-Independent Component-Based UX Library | CSS Tricks](https://css-tricks.com/shoelace-component-frameowrk-introduction/)

- Sevelte

  - [Docs](https://svelte.dev/docs/introduction)
  - [Tutorial](https://learn.svelte.dev/tutorial/welcome-to-svelte)

- SitePoint | A Beginner’s Guide to SvelteKit
  - Walkthrough of SvelteKit Demo Template
    - I used this to bone up on project layout (which seems to have changed since I worked through the tutorial the first time) and best practices.
  - [Tutorial](https://www.sitepoint.com/a-beginners-guide-to-sveltekit/)
  - Local file repositories:
    - `DevOps/\_Tutorials/ . . .
      - 230131-svelteKitExample.stack
        - I worked in this one
        - Varies from tutorial in that it has JDoc style typeScript
      - svelteKit-example-app
        - Pristine install (no TypeScript)
  - Files deleted to start new project
    - (compare this to skeleton template?)

```bash
# contents of lib folder
rm src/lib/*

# Sverdle game
rm -rf src/routes/sverdle

# Sverdle components
rm -rf src/routes/Counter.svelte
rm -rf src/routes/Header.svelte
```

- Replace the contents of `routes/styles.css` with basic CSS

## Initial stack installation

```bash
npm create svelte@latest myapp
cd myapp
npm install
npm run dev
```
