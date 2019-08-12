module.exports = class BuildStep {
  constructor (name) {
    this.name = name
  }

  runningDesc () {}

  execute () {}
}
