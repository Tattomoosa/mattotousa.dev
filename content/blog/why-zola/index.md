+++
title = "Why Zola?"
date = 2021-09-07
[extra]
lead = "One Static Site Generator to Rule Them All"
+++

There are a _lot_ of static site generators out there.
Before I settled on using Zola,
I built out very small sites in
several frameworks, including
Hugo, Gatsby, and NextJS.

You already know I settled on Zola.
It is, in my opinion, more flexible and yet simpler than the alternatives.
I have a couple of things I would like to see added,
but my experience with it so far has been great.

<!-- more -->

Zola has a pretty unassuming website:

![Zola's website](zola-site.png)

No logo, no fancy front end stuff, just a solid site with the stuff you need in
(mostly) easy to find places. (More on that later)

It has the standards you'd expect - Markdown content with some front-matter
(in this case within a TOML `+++` block)
that renders out to template pages.

## The Good

### _Speed_

Zola is _fast_.

Coming from mostly node-based workflows for web development,
such as Webpack/Parcel or other static site generators like Gatsby, the speed seems
unreal. Many times edits take less than 1 millisecond to build and reload the
development server, and very rarely over 10.

And because it builds out plain HTML, it's easy to make a site that loads _fast_
too. Coming from working in React a lot, and doing a lot of work to optimize the
initial paint (lazy-loading components, initial HTML that's a facsimile of the
final design, etc.) it's been great to work with plain HTML again and just watch
it load immediately.

Don't get me wrong, I love React, especially the newer functional components and
useState features.
It's a great technology for building
applications with complex state. [CSZ@PDX](@/projects/csz-at-pdx/index.md) would have
been a _lot_ more difficult to build out without React.
But for a _blog_? No thanks.
The web does documents by default, so if I'm just serving documents I'd
much rather just basic web technology.
And Zola excels for building this without much overhead.

### Flexible Structure Based on Files

Zola doesn't care if you're making a blog or something else entirely.
This was a huge selling point for me because I wanted the Project section.
(Which, as of right now, has a ton more content than the blog)
It generates pages based off of any files or folders in the `content` directory.
For example, in the source for this site, the file
that will become this page is at `/content/blog/why_zola.md`.
The template I'm using for the page is specified in `/content/blog/_index.md` as the
`page-template` field.

```bash
# /content/blog/_index.md

+++
title = "Blog"
sort_by = "date"
template = "blog.html"
page_template = "blog-page.html"
+++

...
```

I didn't have to do anything to get my desired blog post behavior, it's all
just built-in to work in a flexible way.
(For pages where a custom order is desired, you can sort by a "weight" field
which you can set from within markdown files.)

But -- even better -- the Projects page and it's corresponding content pages are
set up _exactly_ the same way.

### Easy Internal Links

Want a link on your site to another page on the site? Easy -- just link to the file.
Take this link to the [CSZ@PDX](@/projects/csz-at-pdx/index.md) project,
in the source file I'm working in, it looks like this:

```md
[CSZ@PDX](@/projects/csz-at-pdx/index.md)
```

`@` is partly a shorthand to the `content` directory but it also tells Zola
it's looking at a _source path_ it needs to transform and not a real path.

### Shortcodes & Embedded HTML

Another pet peeve of mine with static site generators is that markdown content
is often far too restrictive. If you want to put in some kind of 'widget', often
the process is fairly complicated if you're not simply out of luck.
Zola solves this by allowing embedded HTML and something they call "shortcodes".
Embedding HTML is obviously kind of gross for all but the simplest tasks, but still
in my opinion a very important feature to have for the odd small one-off formatting
sort of thing.

Shortcodes, however, are awesome.
They are basically simple "functions" that allow for easily embedding complex HTML/JS
components into Markdown. A really good example from the
[docs](https://www.getzola.org/documentation/content/shortcodes/)
is a YouTube embed function:

```zola
<div {% if class %}class="{{class}}"{% endif %}>
    <iframe
        src="https://www.youtube.com/embed/{{id}}{% if autoplay %}?autoplay=1{% endif %}"
        webkitallowfullscreen
        mozallowfullscreen
        allowfullscreen>
    </iframe>
</div>
```

### Anchors (Like This One)

If you're on desktop right now, you can see the table of contents on the left.
This was marked up with minimal effort by the following code snippet, lifted
from Zola's docs.

```html
{% if page.toc %}
<ul class="toc">
  {% for h1 in page.toc %}
  <li>
    <a href="{{ h1.permalink | safe }}">{{ h1.title }}</a>
    {% if h1.children %}
    <ul>
      {% for h2 in h1.children %}
      <li>
        <a href="{{ h2.permalink | safe }}"> {{ h2.title }} </a>
      </li>
      {% endfor %}
    </ul>
    {% endif %}
  </li>
  {% endfor %}
</ul>
{% endif%}
```

### Simple Composeable Templates

Zola allows templates to extend other templates, or loaded in as children.
This is fantastic.
I have one main template called `base.html` that all my other templates extend from.
This template contains everything necessary for the header and footer of the site,
so the templates extending it only need to worry about the actual content.

### Easy Image Processing At Build Time

I have a system where thumbnail images are input automatically from the folder
containing the content, in a file called `thumbnail.png`.
Take this post, which looks something like this on disk:

```txt
- blog
  |- why-zola
     |- index.md
     |- thumbnail.png
     |- other-picture.png
     |- ...
```

In order to put the thumbnail on the Blog section, all I need to do is something
like this:

<!-- prettier-ignore -->
```html
{% for page in section.pages %}
<a class="blog-summary" href="{{ page.permalink | safe }}">
  {% set image_path = page.path ~ 'thumbnail.png' %}
  {% set image = resize_image(path=image_path, width=300, op='fit_width') %}
  <img src="{{ image.url }}" />
  <!-- ... -->
</a>
{% endfor %}
```

The thumbnails on the Project page are done similarly.

### Sass (SCSS)

Sass is the best approach to writing CSS. It utilizes everything that's good
(and there is good) about native CSS, while adding another layer of organization.
I don't write much of the Python-style Sass language, but the more CSS-looking
SCSS is fantastic. And SCSS just works in Zola, just by including it in your html
with a `.css` extension.

## The Not So Good

### No line numbers

> _EDIT:_ Zola _does_ support line numbers. For a markdown fenced codeblock like
>
> ````md
> ```html
> <div>Hello World</div>
> ```
> ````
>
> Simply add `,linenos` to the language string:
>
> ````md
> ```html,linenos
> <div>Hello World</div>
> ```
> ````
>
> _TADA!_ (Note: May still be in desperate need of styling.)
>
> ```html,linenos
> <div>Hello World</div>
> ```
>
> As far as I can tell, though, there's no way to make the line numbers start
> at a specific number. This would be a really helpful feature for tutorial writing.
> That said, the `linenos` trick wasn't in the docs so maybe
> the feature exists and I just need to poke around in the source to find it.

There's no line numbers in code rendering. No problem, I thought, inspecting
the rendered output and seeing a bunch of `<span>` tags.
I thought, [_I know exactly what to do_](https://css-tricks.com/):
[Line counting CSS.](https://css-tricks.com/almanac/properties/c/counter-increment/)

```scss
pre span {
  counter-increment: line;
  &:before {
    content: counter(line);
    color: white;
  }
}
```

But, to my abject _horror_, it came out looking like this instead:

![Oh the humanity](messed-up-line-numbers.png)

It turns out the codeblocks are styled with `<span>`s corresponding to syntax tokens, but
there is no semantic markup for line breaks.

If each line had a `<span>` or `<div>` or even table row of its own,
this sort of trick would work,
incrementing a counter for each consecutive matching element on the page.
This is a _great_ trick, too, because those line numbers are not user-selectable.

This means in order to get nice line numbers I would have to parse the output
with JavaScript running on the client's machine.
That's fine, but kind of counter-intuitive to the point of generating it statically
and sending it completely formed.

At the time of this writing, the [ThreeJS](https://threejs.org/) homepage is the _only_ JavaScript on
this site, and I sort of considered it a challenge to keep it that way.

> Busted -- The mobile nav does have a little bit of JavaScript, progressively enhanced.

If you see line numbers on any of the real code snippets above, you know I caved
and did some JavaScript to it.

### Small Frustrations The Docs

#### The Tera Templating Engine

If you want to do anything fancy with Zola, you _have to_ check the Tera docs.
Tera is the templating engine Zola uses.
This is to be expected for really complex templating manipulations,
but in my opinion Zola's docs should have all common use cases covered with examples.
This also isn't helped by Tera's docs, where the first section
is about using the library from within a Rust context.

An easy solution is that Zola could link straight to
the [Templates Introduction](https://tera.netlify.app/docs/#introduction)
which is really where most of the useful information for someone using Zola is.

#### Syntax Highlighting Themes

Okay this one drove me a bit crazy. Zola supports _a ton_ of syntax highlighting
themes simply from setting them in the config file. **That's great**.

What's not great is if you go on their documentation and go to the "Syntax Highlighting"
section there isn't a list of supported themes. There is a list of supported _languages_
(good!) but the corresponding list of themes is absent.

No list comes up if you google "zola syntax highlighting support themes" or any
variation of that I tried either.
There is, in fact, a list of themes in the Zola documentation, though.
On the "Configuration" page, towards the bottom.

In Zola's defense, it does make some sense here.
You do set it in the config file.
I did know this, it's why I eventually checked that page.
The way I see it there are three great and easy solutions, and I would be happy with any of them.

1. Leave syntax highlighting list where it is, link to it directly from the Syntax Highlighting page
2. Move the list to the syntax highlighting page.
3. Make it so the same list shows up in both places.

All good solutions.

### The Name

Zola is great as a name aesthetically, I have no issues with it.
Search the web for "zola" though.

![Static Site Generator and... Wedding Business??](./zola-search-results.png)

Not exactly the Zola I wanted.
Zola.com is some kind of wedding business.
I don't know what they do exactly, but they have a big internet presence.
It's only a mild inconvenience, but I'm really reaching for downsides here, okay?

## The Point

I like this site.
I've been very happy with the process of developing it so far,
and so I like Zola too.
If you're building a new site, and it benefits from the good stuff above and
you aren't too bothered by any of the drawbacks I mentioned, check it out.

I don't think you'll regret it.
