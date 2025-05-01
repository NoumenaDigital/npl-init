# npl-init

Starter project intended to be a quick start for writing NPL and deploying it in an engine in DEV_MODE.

## Installation

First, install the [NPL-Dev](https://plugins.jetbrains.com/plugin/22954-noumena-protocol-language-npl-) plugin in
IntelliJ if it is not already installed.

Two methods are available for cloning and utilizing the project:

1) Via the command shell, first create a directory and then execute the git clone command

```
mkdir npl-init && curl -sL https://api.github.com/repos/NoumenaDigital/npl-init/tarball | tar xz --strip-components=1 -C npl-init
```

or

2) Through IntelliJ, if it's your initial use of Github in IntelliJ, navigate to the 'Projects' tab in the sidebar,
   select 'Get from VCS', select 'Git' in the 'Version control' dropdown, and copy this URL into the URL
   field: https://github.com/NoumenaDigital/npl-init.git. You must choose a location on your machine in the '
   Directory' field to clone to the project.

In IntelliJ, go to `File`, `Open...`, navigate to the directory, and simply open it. Once imported, right-click on the
folder `src/main/npl-1.0`, go to `Mark directory as` and select `Sources Root`. Similarly mark `src/main/test` as
`Test Sources Root`.

## Execution

Tests can be run in IntelliJ using the run actions in test files, in file gutters or by using a right-click menu.

Tests can be automatically run using `npl test` (requires the NPL CLI) on the command line.

You should now be able to start programming NPL!

## In details

### Setup check

To ensure your development environment is ready, tests provided in the project should pass.
The setup can be tested by running a test in the `src/test/npl/objects/test_iou.npl` file.

When clicking on the green arrow next to a test, select run all tests or run test in the current file.
Tests should execute and all should pass. If so, your development environment is ready.

The plugin also indicates syntax errors, allows for more detailed tests results and debug your code.
A visualisation of protocols in a PlantUML diagram, and the state machine is also available.

### Implementation

The code in the `npl-init` repository illustrate the settlement of a debt, also referred to as IOU, against a car.
When the car is transferred, an IOU issued by the first car owner is forgiven.

This example can help you get familiar with the key concepts of NPL like protocols and state machines.
To implement your own use-case, you can create new folders and files in the `src/main/npl-1.0` folder.

The [NOUMENA documentation](https://documentation.noumenadigital.com/language/) provides more details about the
language.

### Run your code

In the `npl-init` project, some functions without parameters are grouped in the `src/main/npl-1.0/processes/demo.npl`
file.
These functions can be run or debugged from the file, by clicking on `Running function in a new sandbox session` from
the file gutter.

Test are located in `src/test/npl/objects/test_iou.npl` and can be run or debugged in a similar manner.

From the command line, tests can be run with the NPL CLI: `npl test`

### Support

For any question, reach out to us at [info@noumenadigital.com](mailto:info@noumenadigital.com).

What interaction will you be modelling next?
