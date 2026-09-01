#!/usr/bin/env python3

from http.server import (
    ThreadingHTTPServer,
    BaseHTTPRequestHandler,
)
from pathlib import Path
from datetime import datetime
import argparse
import json
import secrets
import subprocess
import sys


ROOT = (
    Path(__file__)
    .resolve()
    .parents[1]
)

SOURCE = (
    ROOT
    /
    "data/blind-model-guess.json"
)

BUILDER = (
    ROOT
    /
    "tools/build_blind_guess.py"
)

TOKEN = (
    secrets
    .token_urlsafe(32)
)


def load_data():

    return json.loads(
        SOURCE.read_text(
            encoding="utf-8"
        )
    )


def clean_candidate(item):

    model_id = str(
        item.get(
            "id",
            ""
        )
    ).strip()

    name = str(
        item.get(
            "name",
            ""
        )
    ).strip()

    provider = str(
        item.get(
            "provider",
            ""
        )
    ).strip()

    logo = str(
        item.get(
            "logo",
            ""
        )
    ).strip()

    status = str(
        item.get(
            "status",
            "Candidate"
        )
    ).strip()

    note = str(
        item.get(
            "note",
            ""
        )
    ).strip()


    raw_votes = item.get(
        "votes"
    )


    votes = None

    if (
        raw_votes
        is not None
        and
        str(raw_votes).strip()
        != ""
    ):

        try:

            votes = max(
                0,
                int(
                    raw_votes
                )
            )

        except Exception:

            votes = None


    result = {

        "id":
            model_id,

        "provider":
            provider,

        "name":
            name,

        "logo":
            logo,

        "votes":
            votes,

        "votesPublished":
            votes
            is not None,

        "status":
            status
            or
            "Candidate"

    }


    if note:

        result[
            "note"
        ] = note


    return result


def normalize(data):

    current = load_data()


    result = {
        **current,
        **{
            key:value
            for key,value
            in data.items()
            if key
            not in {
                "candidates",
                "knownPublishedVotes",
                "countsComplete",
                "updatedAt",
            }
        }
    }


    candidates = []


    seen = set()


    for raw in data.get(
        "candidates",
        []
    ):

        item = clean_candidate(
            raw
        )


        if (
            not item["id"]
            or
            not item["name"]
        ):

            continue


        if item["id"] in seen:

            continue


        seen.add(
            item["id"]
        )


        candidates.append(
            item
        )


    result[
        "candidates"
    ] = candidates


    published = [
        item
        for item in candidates
        if item.get(
            "votesPublished"
        )
    ]


    result[
        "knownPublishedVotes"
    ] = sum(
        int(
            item.get(
                "votes",
                0
            )
            or 0
        )
        for item in published
    )


    result[
        "countsComplete"
    ] = bool(
        candidates
    ) and (
        len(published)
        ==
        len(candidates)
    )


    result[
        "updatedAt"
    ] = (
        datetime
        .now()
        .astimezone()
        .isoformat(
            timespec="seconds"
        )
    )


    return result


def run(
    command
):

    result = subprocess.run(
        command,
        cwd=ROOT,
        text=True,
        capture_output=True,
    )


    return {
        "returncode":
            result.returncode,

        "stdout":
            result.stdout,

        "stderr":
            result.stderr,
    }


def save_data(
    incoming
):

    data = normalize(
        incoming
    )


    SOURCE.write_text(
        json.dumps(
            data,
            ensure_ascii=False,
            indent=2
        )
        +
        "\n",
        encoding="utf-8"
    )


    build = run([
        sys.executable,
        str(BUILDER),
    ])


    return (
        data,
        build
    )


def page():

    html = r'''<!doctype html>

<html lang="en">

<head>

<meta charset="utf-8">

<meta
  name="viewport"
  content="width=device-width,initial-scale=1"
>

<title>
  Blind Model Guess Admin
</title>


<style>

:root{
  --bg:#fff;
  --text:#111;
  --muted:#6b6b67;
  --line:#deded9;
  --soft:#f7f7f4;
  --max:1180px;
}

*{
  box-sizing:border-box;
}

body{
  margin:0;

  background:var(--bg);
  color:var(--text);

  font-family:
    "OpenAI Sans",
    "Inter",
    ui-sans-serif,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Helvetica,
    Arial,
    sans-serif;

  letter-spacing:-.012em;
}

button,
input,
textarea{
  font:inherit;
}

header{
  position:sticky;
  top:0;
  z-index:50;

  border-bottom:
    1px solid
    var(--line);

  background:
    rgba(255,255,255,.95);

  backdrop-filter:
    blur(16px);
}

.nav{
  max-width:var(--max);
  height:66px;

  margin:auto;
  padding:0 22px;

  display:flex;
  align-items:center;
  justify-content:space-between;
}

.brand{
  font-size:18px;
  font-weight:600;
  letter-spacing:-.04em;
}

.local{
  color:var(--muted);
  font-size:11px;
}

main{
  max-width:var(--max);

  margin:auto;

  padding:
    55px
    22px
    100px;
}

.hero{
  display:flex;

  justify-content:space-between;
  align-items:flex-end;

  gap:30px;

  padding-bottom:35px;

  border-bottom:
    1px solid
    var(--line);
}

h1{
  margin:0;

  font-size:
    clamp(
      44px,
      7vw,
      82px
    );

  line-height:.95;

  font-weight:500;
  letter-spacing:-.06em;
}

.hero-copy{
  max-width:430px;

  color:var(--muted);

  font-size:12px;
  line-height:1.6;
}

.toolbar{
  position:sticky;
  top:66px;

  z-index:40;

  display:flex;
  flex-wrap:wrap;

  gap:8px;

  padding:
    17px
    0;

  background:#fff;

  border-bottom:
    1px solid
    var(--line);
}

.button{
  min-height:41px;

  padding:
    0
    14px;

  border:
    1px solid
    var(--line);

  border-radius:9px;

  background:#fff;

  cursor:pointer;
}

.button.primary{
  border-color:#111;

  background:#111;
  color:#fff;
}

.button.danger{
  color:#a12626;
}

.stats{
  display:grid;

  grid-template-columns:
    repeat(3,1fr);

  margin-top:35px;

  border:
    1px solid
    var(--line);

  border-radius:14px;

  overflow:hidden;
}

.stat{
  padding:20px;
}

.stat:not(:first-child){
  border-left:
    1px solid
    var(--line);
}

.stat-k{
  color:var(--muted);
  font-size:10px;
}

.stat-v{
  margin-top:8px;

  font-size:25px;

  letter-spacing:-.04em;
}

.rows{
  margin-top:24px;

  display:grid;

  gap:12px;
}

.card{
  padding:20px;

  border:
    1px solid
    var(--line);

  border-radius:14px;

  background:var(--soft);
}

.card-head{
  display:flex;

  justify-content:space-between;
  align-items:center;

  gap:15px;

  margin-bottom:18px;
}

.card-title{
  font-size:18px;

  letter-spacing:-.025em;
}

.grid{
  display:grid;

  grid-template-columns:
    repeat(2,minmax(0,1fr));

  gap:12px;
}

.field.full{
  grid-column:
    1
    /
    -1;
}

label{
  display:block;

  margin-bottom:6px;

  color:var(--muted);

  font-size:9px;
  text-transform:uppercase;
  letter-spacing:.055em;
}

input,
textarea{
  width:100%;

  border:
    1px solid
    var(--line);

  border-radius:8px;

  background:#fff;

  padding:
    10px
    11px;

  outline:none;
}

textarea{
  min-height:90px;

  resize:vertical;

  line-height:1.5;
}

input:focus,
textarea:focus{
  border-color:#999;
}

.output{
  margin-top:25px;

  min-height:80px;

  padding:15px;

  border:
    1px solid
    var(--line);

  border-radius:10px;

  background:#111;
  color:#eee;

  white-space:pre-wrap;

  font-family:
    ui-monospace,
    SFMono-Regular,
    Menlo,
    Consolas,
    monospace;

  font-size:10px;
  line-height:1.5;
}

@media(max-width:700px){

  .hero{
    align-items:flex-start;
    flex-direction:column;
  }

  .stats{
    grid-template-columns:1fr;
  }

  .stat:not(:first-child){
    border-left:0;
    border-top:
      1px solid
      var(--line);
  }

  .grid{
    grid-template-columns:1fr;
  }

}

</style>

</head>


<body>


<header>

  <div class="nav">

    <div class="brand">
      Zorix Control Center
    </div>

    <div class="local">
      Blind model guesses · localhost only
    </div>

  </div>

</header>


<main>

  <section class="hero">

    <div>

      <h1>
        Blind guess<br>
        admin
      </h1>

    </div>

    <div class="hero-copy">

      Manage candidates and published community vote counts
      for /guess/blind/model/.

      Saving rebuilds data.js locally.
      Publishing commits only the blind-guess files and pushes them.

    </div>

  </section>


  <div class="toolbar">

    <button
      class="button"
      id="add"
      type="button"
    >
      + Add model
    </button>

    <button
      class="button primary"
      id="save"
      type="button"
    >
      Save changes
    </button>

    <button
      class="button"
      id="publish"
      type="button"
    >
      Publish to GitHub
    </button>

    <button
      class="button"
      id="reload"
      type="button"
    >
      Reload
    </button>

  </div>


  <div class="stats">

    <div class="stat">

      <div class="stat-k">
        Candidates
      </div>

      <div
        class="stat-v"
        id="candidateCount"
      >
        —
      </div>

    </div>


    <div class="stat">

      <div class="stat-k">
        Published votes
      </div>

      <div
        class="stat-v"
        id="voteTotal"
      >
        —
      </div>

    </div>


    <div class="stat">

      <div class="stat-k">
        Counts
      </div>

      <div
        class="stat-v"
        id="countState"
      >
        —
      </div>

    </div>

  </div>


  <div
    class="rows"
    id="rows"
  ></div>


  <pre
    class="output"
    id="output"
  >Ready.</pre>

</main>


<script>

const TOKEN =
  "__TOKEN__";


let state = {
  candidates:[]
};


const rows =
  document.getElementById(
    "rows"
  );


const output =
  document.getElementById(
    "output"
  );


function esc(value){

  return String(
    value ?? ""
  )
  .replace(/&/g,"&amp;")
  .replace(/</g,"&lt;")
  .replace(/>/g,"&gt;")
  .replace(/"/g,"&quot;");

}


function slugify(value){

  return String(
    value || "new-model"
  )
  .trim()
  .toLowerCase()
  .replace(
    /[^a-z0-9]+/g,
    "-"
  )
  .replace(
    /^-+|-+$/g,
    ""
  );

}


function stats(){

  const published =
    state.candidates
      .filter(
        item=>
          item.votes !==
          null
          &&
          item.votes !==
          ""
      );


  const total =
    published.reduce(
      (sum,item)=>
        sum
        +
        Number(
          item.votes || 0
        ),
      0
    );


  document
    .getElementById(
      "candidateCount"
    )
    .textContent =
      state.candidates.length;


  document
    .getElementById(
      "voteTotal"
    )
    .textContent =
      total.toLocaleString(
        "en-US"
      );


  document
    .getElementById(
      "countState"
    )
    .textContent =
      (
        published.length
        ===
        state.candidates.length
      )
        ? "Complete"
        : "Partial";

}


function render(){

  rows.innerHTML =
    state.candidates
      .map(
        (item,index)=>`

          <article
            class="card"
            data-index="${index}"
          >

            <div class="card-head">

              <div class="card-title">
                ${esc(
                  item.name
                  ||
                  "New candidate"
                )}
              </div>

              <button
                class="button danger"
                type="button"
                data-remove="${index}"
              >
                Remove
              </button>

            </div>


            <div class="grid">

              <div class="field">

                <label>
                  Provider
                </label>

                <input
                  data-field="provider"
                  value="${esc(
                    item.provider
                    ||
                    ""
                  )}"
                >

              </div>


              <div class="field">

                <label>
                  Model name
                </label>

                <input
                  data-field="name"
                  value="${esc(
                    item.name
                    ||
                    ""
                  )}"
                >

              </div>


              <div class="field">

                <label>
                  Stable ID
                </label>

                <input
                  data-field="id"
                  value="${esc(
                    item.id
                    ||
                    ""
                  )}"
                >

              </div>


              <div class="field">

                <label>
                  Published votes
                </label>

                <input
                  data-field="votes"
                  type="number"
                  min="0"
                  value="${
                    item.votes
                    ??
                    ""
                  }"
                  placeholder="blank = unpublished"
                >

              </div>


              <div class="field full">

                <label>
                  Logo path
                </label>

                <input
                  data-field="logo"
                  value="${esc(
                    item.logo
                    ||
                    ""
                  )}"
                  placeholder="/number-of-calls/assets/logos/..."
                >

              </div>


              <div class="field full">

                <label>
                  Status
                </label>

                <input
                  data-field="status"
                  value="${esc(
                    item.status
                    ||
                    "Candidate"
                  )}"
                >

              </div>


              <div class="field full">

                <label>
                  Community note
                </label>

                <textarea
                  data-field="note"
                >${esc(
                  item.note
                  ||
                  ""
                )}</textarea>

              </div>

            </div>

          </article>

        `
      )
      .join("");


  rows
    .querySelectorAll(
      ".card"
    )
    .forEach(
      card=>{

        const index =
          Number(
            card.dataset.index
          );


        card
          .querySelectorAll(
            "[data-field]"
          )
          .forEach(
            field=>{

              field.addEventListener(
                "input",
                ()=>{

                  const key =
                    field.dataset.field;


                  let value =
                    field.value;


                  if(key==="votes"){

                    value =
                      value.trim()===""
                        ? null
                        : Number(
                            value
                          );

                  }


                  state
                    .candidates[
                      index
                    ][key] =
                      value;


                  stats();

                }
              );

            }
          );

      }
    );


  rows
    .querySelectorAll(
      "[data-remove]"
    )
    .forEach(
      button=>{

        button.addEventListener(
          "click",
          ()=>{

            const index =
              Number(
                button.dataset.remove
              );


            state.candidates.splice(
              index,
              1
            );


            render();

          }
        );

      }
    );


  stats();

}


function collect(){

  return {
    ...state,
    candidates:
      state.candidates.map(
        item=>({
          ...item,
          id:
            item.id
            ||
            slugify(
              item.name
            )
        })
      )
  };

}


async function request(
  path,
  body
){

  const response =
    await fetch(
      path,
      {
        method:"POST",

        headers:{
          "Content-Type":
            "application/json",

          "X-Zorix-Admin-Token":
            TOKEN
        },

        body:
          JSON.stringify(
            body
          )
      }
    );


  const result =
    await response.json();


  if(!response.ok){

    throw new Error(
      result.error
      ||
      "Request failed"
    );

  }


  return result;

}


async function load(){

  output.textContent =
    "Loading...";


  try{

    const response =
      await fetch(
        "/api/data"
      );


    state =
      await response.json();


    if(
      !Array.isArray(
        state.candidates
      )
    ){

      state.candidates=[];

    }


    render();


    output.textContent =
      (
        "Loaded "
        +
        state.candidates.length
        +
        " candidates."
      );

  }catch(error){

    output.textContent =
      String(error);

  }

}


document
  .getElementById(
    "add"
  )
  .addEventListener(
    "click",
    ()=>{

      state
        .candidates
        .push({

          id:"",
          provider:"",
          name:"",
          logo:"",
          votes:null,
          status:"Candidate",
          note:""

        });


      render();


      window.scrollTo({
        top:
          document
            .body
            .scrollHeight,

        behavior:"smooth"
      });

    }
  );


document
  .getElementById(
    "save"
  )
  .addEventListener(
    "click",
    async ()=>{

      output.textContent =
        "Saving...";


      try{

        const result =
          await request(
            "/api/save",
            {
              data:
                collect()
            }
          );


        state =
          result.data;


        render();


        output.textContent =
          (
            "Saved.\n\n"
            +
            (
              result.build.stdout
              ||
              ""
            )
            +
            (
              result.build.stderr
                ? (
                    "\n"
                    +
                    result.build.stderr
                  )
                : ""
            )
          );

      }catch(error){

        output.textContent =
          String(error);

      }

    }
  );


document
  .getElementById(
    "publish"
  )
  .addEventListener(
    "click",
    async ()=>{

      output.textContent =
        "Saving and publishing...";


      try{

        const result =
          await request(
            "/api/publish",
            {
              data:
                collect(),

              message:
                "Update blind model guess poll"
            }
          );


        state =
          result.data;


        render();


        output.textContent =
          result.output;

      }catch(error){

        output.textContent =
          String(error);

      }

    }
  );


document
  .getElementById(
    "reload"
  )
  .addEventListener(
    "click",
    load
  );


load();

</script>

</body>

</html>
'''

    return html.replace(
        "__TOKEN__",
        TOKEN
    )


class Handler(
    BaseHTTPRequestHandler
):

    def json_response(
        self,
        status,
        payload
    ):

        body = json.dumps(
            payload,
            ensure_ascii=False,
            indent=2
        ).encode(
            "utf-8"
        )


        self.send_response(
            status
        )

        self.send_header(
            "Content-Type",
            "application/json; charset=utf-8"
        )

        self.send_header(
            "Content-Length",
            str(
                len(body)
            )
        )

        self.send_header(
            "Cache-Control",
            "no-store"
        )

        self.end_headers()

        self.wfile.write(
            body
        )


    def text_response(
        self,
        text
    ):

        body = text.encode(
            "utf-8"
        )


        self.send_response(
            200
        )

        self.send_header(
            "Content-Type",
            "text/html; charset=utf-8"
        )

        self.send_header(
            "Content-Length",
            str(
                len(body)
            )
        )

        self.send_header(
            "Cache-Control",
            "no-store"
        )

        self.end_headers()

        self.wfile.write(
            body
        )


    def do_GET(
        self
    ):

        if self.path in {
            "/",
            "/index.html",
        }:

            self.text_response(
                page()
            )

            return


        if self.path == "/api/data":

            try:

                self.json_response(
                    200,
                    load_data()
                )

            except Exception as error:

                self.json_response(
                    500,
                    {
                        "error":
                            str(error)
                    }
                )

            return


        self.json_response(
            404,
            {
                "error":
                    "Not found"
            }
        )


    def do_POST(
        self
    ):

        if (
            self.headers.get(
                "X-Zorix-Admin-Token"
            )
            !=
            TOKEN
        ):

            self.json_response(
                403,
                {
                    "error":
                        "Invalid local admin token"
                }
            )

            return


        try:

            size = int(
                self.headers.get(
                    "Content-Length",
                    "0"
                )
            )


            payload = json.loads(
                self.rfile.read(
                    size
                )
                .decode(
                    "utf-8"
                )
                or "{}"
            )


            if self.path == "/api/save":

                data,build = save_data(
                    payload.get(
                        "data",
                        {}
                    )
                )


                self.json_response(
                    200,
                    {
                        "ok":
                            True,

                        "data":
                            data,

                        "build":
                            build,
                    }
                )

                return


            if self.path == "/api/publish":

                data,build = save_data(
                    payload.get(
                        "data",
                        {}
                    )
                )


                message = str(
                    payload.get(
                        "message",
                        "Update blind model guess poll"
                    )
                ).replace(
                    "\n",
                    " "
                ).strip()


                if not message:

                    message = (
                        "Update blind model guess poll"
                    )


                add = run([
                    "git",
                    "add",
                    "data/blind-model-guess.json",
                    "guess/blind/model/data.js",
                    "guess/blind/model/index.html",
                    "tools/blind_guess_admin.py",
                ])


                diff = subprocess.run(
                    [
                        "git",
                        "diff",
                        "--cached",
                        "--quiet",
                        "--",
                        "data/blind-model-guess.json",
                        "guess/blind/model/data.js",
                        "guess/blind/model/index.html",
                        "tools/blind_guess_admin.py",
                    ],
                    cwd=ROOT,
                )


                commit = {
                    "returncode":0,
                    "stdout":
                        "No new staged changes to commit.\n",
                    "stderr":"",
                }


                if diff.returncode != 0:

                    commit = run([
                        "git",
                        "commit",
                        "--only",
                        "data/blind-model-guess.json",
                        "guess/blind/model/data.js",
                        "guess/blind/model/index.html",
                        "tools/blind_guess_admin.py",
                        "-m",
                        message,
                    ])


                push = run([
                    "git",
                    "push",
                ])


                output = (
                    "BUILD\n"
                    +
                    (
                        build.get(
                            "stdout",
                            ""
                        )
                        or
                        ""
                    )
                    +
                    "\nADD\n"
                    +
                    (
                        add.get(
                            "stdout",
                            ""
                        )
                        or
                        ""
                    )
                    +
                    (
                        add.get(
                            "stderr",
                            ""
                        )
                        or
                        ""
                    )
                    +
                    "\nCOMMIT\n"
                    +
                    (
                        commit.get(
                            "stdout",
                            ""
                        )
                        or
                        ""
                    )
                    +
                    (
                        commit.get(
                            "stderr",
                            ""
                        )
                        or
                        ""
                    )
                    +
                    "\nPUSH\n"
                    +
                    (
                        push.get(
                            "stdout",
                            ""
                        )
                        or
                        ""
                    )
                    +
                    (
                        push.get(
                            "stderr",
                            ""
                        )
                        or
                        ""
                    )
                )


                self.json_response(
                    200,
                    {
                        "ok":
                            (
                                push.get(
                                    "returncode"
                                )
                                ==
                                0
                            ),

                        "data":
                            data,

                        "output":
                            output,
                    }
                )

                return


            self.json_response(
                404,
                {
                    "error":
                        "Unknown API"
                }
            )


        except Exception as error:

            self.json_response(
                500,
                {
                    "error":
                        str(error)
                }
            )


    def log_message(
        self,
        format,
        *args
    ):

        print(
            "[blind-guess-admin]",
            format % args
        )


def main():

    parser = argparse.ArgumentParser()

    parser.add_argument(
        "--host",
        default="127.0.0.1"
    )

    parser.add_argument(
        "--port",
        type=int,
        default=8790
    )

    args = parser.parse_args()


    server = ThreadingHTTPServer(
        (
            args.host,
            args.port
        ),
        Handler
    )


    print(
        "Blind Guess Admin:"
    )

    print(
        f"http://{args.host}:{args.port}/"
    )

    print(
        "Binding:",
        args.host
    )


    try:

        server.serve_forever()

    except KeyboardInterrupt:

        pass

    finally:

        server.server_close()


if __name__ == "__main__":

    main()
