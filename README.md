# TrojanZoo Sphinx Theme

[![demo](https://github.com/ain-soph/trojanzoo_sphinx_theme/workflows/demo/badge.svg)](https://ain-soph.github.io/trojanzoo_sphinx_theme/)
[![release](https://img.shields.io/github/v/release/ain-soph/trojanzoo_sphinx_theme)](https://github.com/ain-soph/trojanzoo/releases)
[![pypi](https://img.shields.io/pypi/v/trojanzoo_sphinx_theme)](https://pypi.org/project/trojanzoo_sphinx_theme/)

Sphinx theme for [TrojanZoo Docs](https://ain-soph.github.io/trojanzoo) based on the [Read the Docs Sphinx Theme](https://sphinx-rtd-theme.readthedocs.io/en/latest). Forked from [Pytorch Sphinx Theme](https://github.com/pytorch/pytorch_sphinx_theme) with commit `b4d0005` at 09/24/2021.

## Difference from pytorch_sphinx_theme
This work removes all pytorch-related things and support many customizations. It also removes all other unnecessary items to make it a pure doc template.  
See demos at:  
https://ain-soph.github.io/trojanzoo_sphinx_theme/  
https://ain-soph.github.io/trojanzoo/

## Local Development

Run python setup:

```
python setup.py install
```

and install the dependencies using `pip install -r requirements.txt`

In the root directory install the `package.json`:

```
# node version 8.4.0
yarn install

```

If you have `npm` installed then run:

```
npm install
```

Run grunt to build the html site and enable live reloading of the demo app at `localhost:1919`:

```
grunt
```

The resulting site is a demo.

## Testing your changes and submitting a PR

When you are ready to submit a PR with your changes you can first test that your changes have been applied correctly against either the TrojanZoo Docs repo:

1. Run the `grunt build` task on your branch and commit the build to Github.
2. In your local docs repo, remove any existing `trojanzoo_sphinx_theme` packages in the `src` folder (there should be a `pip-delete-this-directory.txt` file there)
3. In `requirements.txt` replace the existing git link with a link pointing to your commit or branch, e.g. `-e git+git://github.com/{ your repo }/trojanzoo_sphinx_theme.git@{ your commit hash }#egg=trojanzoo_sphinx_theme`
4. Install the requirements `pip install -r requirements.txt`
5. Remove the current build with `make clean`
6. Build the static site with `make html`
7. Open the site at `docs/build/html/index.html` and look around

If your changes have been applied successfully, remove the build commit from your branch and submit your PR.

## Publishing the theme

Before the new changes are visible in the theme the maintainer will need to run the build process:

```
grunt build
```

Once that is successful commit the change to Github.

### Developing locally against TrojanZoo Docs

To be able to modify and preview the theme locally against the TrojanZoo Docs first clone the repositories:

- [TrojanZoo (Docs)](https://github.com/ain-soph/trojanzoo)

Then follow the instructions in the repository to make the docs.

Once the docs have been successfully generated you should be able to run the following to create an html build.

#### Docs

```
# in ./docs
make html
```

Once these are successful, navigate to the `conf.py` file in each project. In the Docs these are at `./docs/source`.

In `conf.py` change the html theme to `trojanzoo_sphinx_theme` and point the html theme path to this repo's local folder, which will end up looking something like:

```
html_theme = 'trojanzoo_sphinx_theme'
html_theme_path = ["../../../trojanzoo_sphinx_theme"]
```

You can then build the Docs by running

```
grunt
```

These will generate a live-reloaded local build for the respective projects available at `localhost:1919`.

Note that while live reloading works the Docs projects are hefty and will take a few seconds to build and reload.

### Built-in Stylesheets and Fonts

There are a couple of stylesheets and fonts inside the Docs repo itself meant to override the existing theme. To ensure the most accurate styles we should comment out those files until the maintainers of that repo remove them:

#### Docs

```
# ./docs/source/conf.py

html_context = {
    # 'css_files': [
    #     'https://fonts.googleapis.com/css?family=Lato',
    #     '_static/css/pytorch_theme.css'
    # ],
}
```

### Top/Mobile Navigation

The top navigation and mobile menu expect an "active" state for one of the menu items. To ensure that "Docs" is marked as active, set the following config value in the respective `conf.py`, where `{project}` is `"docs"`.

```
html_theme_options = {
  ...
  'pytorch_project': {project}
  ...
}
```
