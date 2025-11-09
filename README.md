<div align="center">

[![Spectrum](./public/img/media.png)](https://spectrum.chat)

### Simple, powerful online communities.

</div>

This is the main monorepo codebase of [Spectrum](https://spectrum.chat). Every single line of code that's not packaged into a reusable library is in this repository.

## What is Spectrum?

### Vision

It is difficult to grow, manage and measure the impact of online communities. Community owners need modern, chat-based communities but are running into scaling issues when their community grows beyond a few hundred members. It becomes hard to keep track of who's who, know what conversations are happening, and ensure that the community is staying healthy and productive.

**Spectrum aims to be the best platform to build any kind of community online by combining the best of forums and real-time chat apps.** With best-in-class moderation tooling, a single platform for all your communities, threaded conversations by default, community health monitoring, and much more to come we think that we will be able to help more people start and grow the best online communities.

> "[Spectrum] will take the place that Reddit used to have a long time ago for communities (especially tech) to freely share ideas and interact. Except realtime and trolling-free."
>
> \- [Guillermo Rauch (@rauchg)](https://twitter.com/rauchg/status/930946768841228288)

### Status

Spectrum has been in full-time development since March 2017 and is [part of GitHub since November 2018](https://spectrum.chat/spectrum/general/spectrum-is-joining-github~1d3eb8ee-4c99-46c0-8daf-ca35a96be6ce). See our current priorities and what we are working on in the [main project board](https://github.com/withspectrum/spectrum/projects/23).

<div align="center">
  <img height="50px" src="public/img/cluster-1.svg" />
</div>

## Docs

- [Contributing](#contributing)
  - [Ground Rules](#ground-rules)
  - [Codebase](#codebase)
    - [Technologies](#technologies)
    - [Folder Structure](#folder-structure)
    - [Code Style](#code-style)
  - [First time setup](#first-time-setup)
  - [Running the app locally](#running-the-app-locally)
  - [Roadmap](https://github.com/withspectrum/spectrum/projects/19)
- [Technical](docs/)
  - [Testing](docs/testing/intro.md)
  - [Background Jobs](docs/workers/background-jobs.md)
  - [Deployment](docs/deployments.md)
  - [API](docs/backend/api/)
    - [Fragments](docs/backend/api/fragments.md)
    - [Pagination](docs/backend/api/pagination.md)
    - [Testing](docs/backend/api/testing.md)
    - [Tips and Tricks](docs/backend/api/tips-and-tricks.md)

## Contributing

**We heartily welcome any and all contributions that match our engineering standards!**

That being said, this codebase isn't your typical open source project because it's not a library or package with a limited scope—it's our entire product.

### Ground Rules

#### Contributions and discussion guidelines

#### Start RethinkDB

You'll need to start a local rethinkdb server:

```sh
rethinkdb
```

Then (without closing the rethinkdb tab!) open another tab and start Redis:

```sh
redis-server
```

#### Start the servers

Depending on what you're trying to work on you'll need to start different servers. Generally, all servers run in development mode by doing `yarn run dev:<workername>`, e.g. `yarn run dev:hermes` to start the email worker.

No matter what you're trying to do though, you'll want to have the API running, so start that in a background tab:

```
yarn run dev:api
```

#### Develop the web UI

To develop the frontend and web UI run

```
yarn run dev:web
```

<br />	
<div align="center">	
  <img height="200px" src="public/img/connect.svg" />	
</div>

## GitHub

Spectrum is now part of GitHub. For code of conduct, please see [GitHub's Community Guidelines](https://help.github.com/en/github/site-policy/github-community-guidelines) and [Acceptable Use Policies](https://help.github.com/en/github/site-policy/github-acceptable-use-policies).

## License

BSD 3-Clause, see the [LICENSE](./LICENSE) file.

---

## Contributors

We are deeply grateful to everyone who has contributed to this project. Your time, feedback, code, reviews, and ideas have helped make this project better. Thank you for your contributions and continued support.

**Contributors (as provided):**

- 376TEMP <38068555+376TEMP@users.noreply.github.com>
- Abu Shamsutdinov <yakotikadot@gmail.com>
- Afzal Sayed <afzal@keepworks.com>
- AgtLucas <lucas@agtlucas.com>
- Alejandro Nanez <alejonanez@gmail.com>
- Alejandro Ñáñez Ortiz <alejonanez@gmail.com>
- Alex Dom￸aki￸dis <datio@users.noreply.github.com>
- Alexander Golovanov <a-golovanov@users.noreply.github.com>
- Arthur Denner <arthurdenner7@gmail.com>
- ArturKlajnerok <a.klajnerok@gmail.com>
- Brian Lovin <briandlovin@gmail.com>
- Brian Lovin <brianlovin@Brians-MacBook-Pro.local>
- Brian Lovin <brianlovin@github.com>
- Bryn Jackson <hi@bryn.io>
- Bryn Jackson <superbryntendo@github.com>
- Bryn Jackson <superbryntendo@gmail.com>
- Chenxi Yuan <yuanchenxi95@gmail.com>
- ChenxiYuan <yuanchenxi95@gmail.com>
- Chiamaka Nwolisa <chiamakanwolisa@gmail.com>
- Chris Helgert <chris.helgert@online.de>
- Clayton Ray <iamclaytonray@gmail.com>
- Comus Leong <comus.leong@gmail.com>
- Cut Javascript <cutjavascript@gmail.com>
- Dan <dan@loudbase.com>
- Dan Weaver <danweaver06@gmail.com>
- Deni Cho <dencho.12@gmail.com>
- Dmitriy An <dmitriym44@gmail.com>
- Dmitry Rybin <dmitrika@users.noreply.github.com>
- Esakki Raj <esakkiraj.tce@gmail.com>
- Federico Zivolo <fzivolo@quid.com>
- Freddy Thobhani <thobhani.freddy@gmail.com>
- Gabe Ragland <gabe.ragland@gmail.com>
- Giancarlos C <GianCastle@users.noreply.github.com>
- Idan Wender <idanwe2@gmail.com>
- J.C. Hiatt <jchiatt@me.com>
- Jason Etcovitch <jasonetco@github.com>
- Jeremy Albright <myrlin1@gmail.com>
- Johnny Zabala <jzabala.s@gmail.com>
- Jonathan Cutrell <jonathan.cutrell@gmail.com>
- Jonathan Cutrell <jonathan@whiteboard.is>
- Keraito <dragoon_v2_chak_shun@hotmail.com>
- Kornel Dubieniecki <lekterable@gmail.com>
- Lachlan Campbell <lachlan.campbell@icloud.com>
- Lachlan Campbell <lachlanjc@users.noreply.github.com>
- Laurence Ede <laurence.ede@gmail.com>
- Lucas da Silva <agtlucas@me.com>
- Luke Glazebrook <8593744+Glazy@users.noreply.github.com>
- Matthew Brandly <brandly13@gmail.com>
- Matthew Gaunt <matthew@stormfoundry.co>
- Max <contact@mstoiber.com>
- Max Schoening <max@max.dev>
- Max Stoiber <contact@mxstbr.com>
- Max Stoiber <mxstbr@github.com>
- Maximilian Stoiber <contact@mxstbr.com>
- Maximilian Stoiber <mxstbr@maximilians-mbp.home>
- Michael Knepprath <mknepprath@gmail.com>
- Mike Apicelli <michael.apicelli@gmail.com>
- Mike Grabowski <grabbou@gmail.com>
- Mike Nikles <mikenikles@gmail.com>
- Moritz Kröger <write@morkro.de>
- Naina Razafindrabiby <nainarazz@gmail.com>
- Naina Razafindrabiby <nantenaina.razafindrabiby@dreamslab.fr>
- Pavel Prichodko <prichodko.p@gmail.com>
- Pavlo Tymchuk <pawel.tymczuk@gmail.com>
- REDDY PRASAD <dev.drprasad@aim.com>
- Rafael Almeida <rafaelalmeidatk@gmail.com>
- Richard Deane <titchimoto@gmail.com>
- Rui Botto <rui.figueira@fe.up.pt>
- Sajad Torkamani <sajadtorkamani1@gmail.com>
- Sanchez Eric <eric.cmsfr@gmail.com>
- Sarah Vessels <cheshire137@gmail.com>
- Satya Rohith G <gsatyarohith@gmail.com>
- Simon <sn@hitbox.tv>
- Sivakar Sithamparanathan <sivakar12@outlook.com>
- Stanisław Chmiela <sjchmiela@gmail.com>
- Stefan Németh <mail.stevewinfield@gmail.com>
- StuWood <stuw@convergedirect.com>
- Suguru Inatomi <suguru.inatomi@gmail.com>
- Tacio S. Diogo <taciosd@gmail.com>
- Tadas Antanavicius <3900899+tadasant@users.noreply.github.com>
- Tadas Antanavicius <tadas@solutionloft.com>
- Thomas <roux.tom@gmail.com>
- Thomas Roest <ThomasRoest@users.noreply.github.com>
- Thomas Roux <roux.tom@gmail.com>
- Thomas Sattlecker <thomas.sattlecker@gmail.com>
- Tien Pham <tien.pham@metropolia.fi>
- Tiger Oakes <toakes@mozilla.com>
- Tim Cheung <tim@cheung.io>
- Timothy <1695613+timothyis@users.noreply.github.com>
- Tom Bonnike <bonniketom@gmail.com>
- Tom Scholz <tomscholz@users.noreply.github.com>
- Tom Whale <tom.whale@trinitymirror.com>
- Tyrone Tudehope <tyronetudehope@gmail.com>
- Victor Tortolero <victor.tortolero@wizeline.com>
- Yohix <yohix@protonmail.com>
- Yuriy Dybskiy <yuriy@dybskiy.com>
- Zane <github@zane.sh>
- b1ncer <b1ncer@foxmail.com>
- dependabot-preview[bot] <27856297+dependabot-preview[bot]@users.noreply.github.com>
- depfu[bot] <23717796+depfu[bot]@users.noreply.github.com>
- depfu[bot] <depfu[bot]@users.noreply.github.com>
- edumoreira1506 <contato@eduardoem.com.br>
- edumoreira1506 <eduardo.moreira@codeminer42.com>
- fullstackguyhere <31564466+fullstackguyhere@users.noreply.github.com>
- fullstackguyhere <fullstackguyhere@gmail.com>
- gdad-s-river <arihantverma1994@gmail.com>
- huli <aszx87410@gmail.com>
- jmunoz <jmunoz@tuenti.com>
- k0o <sb.knot@gmail.com>
- lookapanda <lookapanda@ify.re>
- mSeel <michaseel@users.noreply.github.com>
- milad440550 <milad440550@gmail.com>
- momothereal <momothereal.mc@gmail.com>
- nainarazz <nainarazz@gmail.com>
- raunofreiberg <freiberggg@gmail.com>
- ryota-murakami <dojce1048@gmail.com>
- saujanyanagpal104 <saujanyanagpal104@gmail.com>
- tanmoyopenroot <tanmoy.openroot@gmail.com>
- thomasroest <user@example.com>
- uberbryn <hi@bryn.io>
- vigzmv <vigzmv@outlook.com>
- yellobanana <paulxuca@gmail.com>.

_The contributors list above is taken directly from the provided context (the retrieved list of authors)._
