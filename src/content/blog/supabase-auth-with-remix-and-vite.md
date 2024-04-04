---
title: Add authentication to your Remix application with Supabase
description: Adding authentication to your remix app with Supabase has never been easier, this blog post will show you how to get up and running quickly
year: 2024
published_at: 2024-03-08
---

With Supabase now fully supporting doing authentication completely server-side, it has never been easier to take advantage of all of the features that it offers. We'll go through how to quickly spin up a Remix project and add supabase with authentication.

## Spin up a new Remix project

This guide should also work for non-vite Remix projects but my preference is to use vite so we'll use a clean vite template.

```bash
npx create-remix@latest
```

Run this command in your terminal and follow the prompts, then open your new project in your editor of choice. You'll also need to [create a new project in supabase](https://supabase.com/) so that we can get access to the environment variables for this example.

Once you've created a supabase project, in the root of your project create a `.env` file and paste in the values for your `SUPABASE_URL` and `SUPABASE_ANON_KEY`. You can find these values by going into your supabase project dashboard, clicking on the on the connect button and selecting Remix from the frameworks list.

![Supabase dashboard connect button](https://i.ibb.co/k4GYkG8/Screenshot-2024-03-07-at-6-38-35-PM.png)

![Supabase frameworks dropdown list](https://i.ibb.co/HpXVMMW/Screenshot-2024-03-07-at-6-40-13-PM.png)

Lastly, install the `@supabase/ssr` package.

```bash
npm install @supabase/ssr
```

## Setting up authentication

There are a bunch of ways you can set up auth in supabase. E-mail and password combo, E-mail magic link, OAuth and so on. For the sake of this blog post we'll set up E-mail and password since it's the simplest one. Though that should be enough to explore the other methods as well if you wish.

### Create the necessary files

In here we are just creating a utility function so that we can re-use this function across all instances where we need to access supabase resources.

```ts
// app/utils/supabase.server.ts

import { createServerClient, serialize, parse } from "@supabase/ssr";

export function createClient(request: Request) {
  const cookies = parse(request.headers.get("Cookie") ?? "");
  const headers = new Headers();

  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(key) {
          return cookies[key];
        },
        set(key, value, options) {
          headers.append("Set-Cookie", serialize(key, value, options));
        },
        remove(key, options) {
          headers.append("Set-Cookie", serialize(key, "", options));
        },
      },
    },
  );

  return {
    supabase,
    headers,
  };
}
```

This file is for when we are signing up for the first time and receive a confirmation e-mail. Clicking the link with log you in automatically but going forward you will log in through the log in page.

```ts
// app/routes/auth.callback.tsx

import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { createClient } from "~/utils/supabase.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/";
  const { supabase, headers } = createClient(request);

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return redirect(next, { headers });
    }
  }

  return redirect("/auth/auth-error-page", { headers });
}
```

Sign up page, you will recieve a confirmation e-mail for the first time that you sign up. After you click the link in your e-mail you will be signed in.

```ts
// app/routes/signup.tsx

import { ActionFunctionArgs, json } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { createClient } from "~/utils/supabase.server";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const { supabase } = createClient(request);

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return json({ message: error.message }, { status: 400 });
  }
  return null;
}

export default function Component() {
  return (
    <div>
      <h1>Sign up</h1>
      <Form method="POST">
        <label htmlFor="email">E-mail</label>
        <input type="email" name="email" id="email" />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" />
        <button type="submit">Sign up</button>
      </Form>
    </div>
  );
}
```

Log in page, if all goes well then you will be redirected to the home page after logging in successfully.

```ts
// app/routes/login.tsx

import { ActionFunctionArgs, json } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { redirect } from "react-router";
import { createClient } from "~/utils/supabase.server";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const { supabase, headers } = createClient(request);

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return json({ message: error.message }, { status: 400 });
  }
  return redirect("/", { headers });
}

export default function Component() {
  return (
    <div>
      <h1>Log in</h1>
      <Form method="POST">
        <label htmlFor="email">E-mail</label>
        <input type="email" name="email" id="email" />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" />
        <button type="submit">Log in</button>
      </Form>
    </div>
  );
}
```

To verify that everything is working correctly, you can display the information of the currently logged in user.

```ts
// app/_index.tsx

import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { createClient } from "~/utils/supabase.server";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { supabase } = createClient(request);

  const { data } = await supabase.auth.getSession();

  return { user: data?.session?.user };
}

export default function Index() {
  const { user } = useLoaderData<typeof loader>();
  return (
    <div>
      <h1>Currently logged in user</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}
```

Finally, add a log out button and resource route so that you can sign the user out.

```diff
export default function Index() {
  const { user } = useLoaderData<typeof loader>();
  return (
    <div>
      <h1>Currently logged in user</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
+      <Form method="POST" action="/logout">
+        <button type="submit">Log out</button>
+      </Form>
    </div>
  );
}
```

```ts
// app/logout.tsx

import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { createClient } from "~/utils/supabase.server";

export async function action({ request }: ActionFunctionArgs) {
  const { supabase, headers } = createClient(request);
  await supabase.auth.signOut();
  return redirect("/login", { headers });
}

export const loader = () => redirect("/");
```

And with that you have fully functioning authentication!

## Conclusion

This is all that is needed to set up authentication, you can explore the other authentication methods if you choose to do so. I have a [repository set up with Github authentication](https://github.com/nulfrost/supabase-remix-ssr) as well as a [live example of supabase auth in action](https://supabase-ssr-remix.vercel.app/).
