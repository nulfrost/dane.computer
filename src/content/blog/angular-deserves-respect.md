---
title: Angular deserves respect
description: Giving Angular an honest try with Angular 17
year: 2023
published_at: 2023-12-15
---

You've seen the memes, you've seen the angry github comments, you've seen the negative press. I'll be honest, I fell victim to the propaganda online. Was some of it warranted? Probably, but some of it was a bit overexaggerated in my opinion. Seriously, Angular is a really good framework and I think the release of Angular 17 will bring it back into the light and a serious option for building websites. I've only been through the documentation briefly and did the tutorial but there are some things I _really_ like.

## The CLI

One thing I've always admired and wished other frameworks/libraries would have adopted is their version of the Angular CLI. Not only can you use it to create new components with all of the boiler plate code all generated for you, you can also do things like open the docs or quickly add angular modules with `ng add`. I found with the short amount of time I've spent with it, it allows me to move a bit quicker and think less about creating my own scripts or thinking about the most optimal file structure. There are a lot of commands that are just great defaults to have that aren't unique from project to project such as testing. I tell people repeatedly that I wish there was something similar with React but maybe it wouldn't work out the same way as I imagine.

## Pipes

Now if you're not really a Linux user you've probably never heard of the term `pipe` before and when I first saw it mentioned in the Angular docs I had no idea what to expect but it works exactly the same as it does in the terminal. Let's say I have a sentence and I want to count the amount of words in that sentence. In my terminal I could do `echo hello this is a sentence` _and then_ pipe that ( | ) to the `wc` program that's available ("wc" without any options outputs the amount of lines, words and characters from whatever is passed in). So the full command in my terminal would look like this.

```bash
echo hello this is a sentence | wc
//          1   5   25
```

It's the same concept in Angular, which is really cool in my opinion. For example by default Angular has an `uppercase` pipe that transforms some text to uppercase.

```ts
import { Component } from "@angular/core";
import { UppercasePipe } from "@angular/common";

@Component({
  standalone: true,
  templateUrl: `
    <p>Hello my name is {{ name | uppercase }}</p>
  `,
  imports: [UppercasePipe],
})
export class AppComponent {
  name = "Dane";
}
```

You can also make your own pipes to do whatever you need them to, like this capitalize pipe!

```ts
// captialize.ts
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "capitalize",
  standalone: true,
})
export class CapitalizePipe implements PipeTransform {
  transform(value: string): string {
    if (typeof value !== "string" || value.length <= 1) return value;
    let uppercasedFirstLetter = value.slice(0, 1).toUpperCase();
    let restOfWord = value.substring(1, value.length);
    return `${uppercasedFirstLetter}${restOfWord}`;
  }
}
```

```ts
// main.ts
import { Component } from "@angular/core";
import { CapitalizePipe } from "./capitalize";

@Component({
  selector: "app-root",
  standalone: true,
  template: ` Hello world, {{ name | capitalize }} `,
  imports: [CapitalizePipe],
})
export class AppComponent {
  name = "dane";
}
```

Simple examples but you can imagine how useful this is and I honestly prefer writing reusable functions like this.

## Deferrable views

This is something new in Angular and something most frameworks/libraries have included but the way it's been done in Angular is super cool and really simple to grasp. [In the documentation](https://angular.dev/guide/defer) they have a simple example showing how to defer something like a list of comments so that the page loads quicker. Sure, when there are maybe 1 or 2 comments it won't impact page performance much but when that list grows a user will have to wait for the main content _and_ the comments to be loaded. Angular 17 introduces deferrable views to help with this sort of thing. Let's say I want to defer the loading of a list of recipies, I would do something like this:

```ts
@defer {
    <recipie-list />
}
```

That's literally it! In addition to the @defer syntax you can also specify a placeholder. Placeholders are good because it gives the user more information about what's happening and makes it so content doesn't just show up on the page. So combined with the last snippet it could look something like this:

```ts
@defer {
    <recipe-list />
} @placeholder (minimum 500ms) {
    <p>Recipe list is loading...</p>
}
```

The `minimum` parameter let's us say how long the placeholder should show before showing the resolved content. This is done so there isn't a weird flicker after the content is ready to be shown. This only scratches the surface of what Angular gives you to help improve the performance of your website, there are a few examples on how you get fine tuned performance even more with triggers which is definitely worth a read.

I honestly believe Angular should be given another chance with this new release, there are a ton of great features you get out of the box that help with making a performant website. I plan on using Angular to make a side project so I can really explore all of the features in depth and I hope more people do the same!
