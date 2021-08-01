# Solid-Barnacle
Add commands to pull request comments.

Currently only supports `/format`, but more can be added by registering a handler and parsing arguments to the function.

## Inputs
### Format
* **file-extensions:** The file extensions of files you want to pass through the auto-formatter
* **exclude-dirs:** Directories to exclude from the search for files to format
* **c-style:** The style guide for c-style languages formatted with clang-format (C, C#, C++, Java, Javascript, etc.)
* **python-style:** The python style guide. Accepts either `black` or one of the options for the `yapf` formatter.
* **token:** The GitHub token to access pass to OctoKit.

## Output
None, at the moment.

## Usage Example:
```yaml
jobs:
  auto-format:
    if: ${{ github.event.issue.pull_request }}
    runs-on: ubuntu-latest
    steps:
      - name: Clone git repo
        uses: actions/checkout@v2

      - id: Auto-Format
        uses: m-salmankhan/solid-barnacle@main
        with:
          file-extensions:  |
            c h cpp py
          exclude-dirs: ./idea
          c-style: google
          python-style: pep8
          token: ${{ secrets.GITHUB_TOKEN }}
```

## Commands
### /format
Formats all files according to rules in your workflow.
#### Notes:
* Currently takes no arguments. Anything after `/format` is ignored
* Assumes that all C-based languages in a repo follow the same style guide.
* Uses `clang-format` to format c-based languages
* Uses either `black` or `yapf` to format Python code, depending on style guide.


### Registering new commands
Register new commands by passing an implementation of `Handler` to `handlers.registerHandler`.

## To-Do
* Write proper tests with Jest
* Check for security issues with `exec` calls.