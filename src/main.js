import Vue from 'vue'
import App from './App.vue'
import store from './store'
import Shuffle from 'shufflejs'
import * as dynamicAlloc from './dynamic'
import $ from 'jquery'
/* eslint-disable */

Vue.config.productionTip = false

var program = [[1, 130, 'add'], [2, 60,'add'], [3, 100, 'add'], [2, 60, 'free'], [4, 200, 'add'], [3, 100, 'free'], 
[1, 130, 'free'], [5, 140, 'add'], [6, 60, 'add'], [7, 50, 'add'], [6, 60, 'free']]


var programStep = 0
var nowStep = 0

function jsonCopy(src) {
  return JSON.parse(JSON.stringify(src));
}

function deepCloneMem(mem){
  var newMem = new dynamicAlloc.Memory()
  newMem.memoryList = jsonCopy(mem.memoryList)
  newMem.allocateMethod = mem.allocateMethod
  newMem.freeList = jsonCopy(mem.freeList)
  return newMem
}

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')

var Dynamic = function(element){
  this.element = element;
  this.initShuffle();
}

Dynamic.prototype.initShuffle = function(){
  this.shuffle = new Shuffle(
    this.element,{
      itemSelector: '.box',
      speed: 250,
      easing: 'ease',
      sizer: '.my-sizer-element',
    }
  )
}


Dynamic.prototype.getRandomColor = function () {
  return '#' + Math.random().toString(16).slice(2, 8);
}

var colorBox = []
var jobList = []

function colorSort(a, b){
  return a[0] - b[0]
}

program.forEach(function(program){
  var newjobID = program[0]
  if(jobList.indexOf(newjobID) == -1){
    var newColor = Dynamic.prototype.getRandomColor()
    jobList.push(newjobID)
    colorBox.push([newjobID, newColor])
  }
}, jobList, colorBox)

Dynamic.prototype._generateBoxes = function(itemsToCreate){
  var items = []
  var i = 0
  for (i = 0; i < itemsToCreate; i++){
    var random = Math.random();
    var box = document.createElement('div')
    box.className = 'box col-md-12'
    box.style.backgroundColor = this.getRandomColor()
    box.style.height = "640px"
    items.push(box)
  }  
  return items
}

Dynamic.prototype._getArrayOfElementsToAdd = function(){
  return this._generateBoxes(5)
}

Dynamic.prototype._getHtmlMarkupToAdd = function () {
  var fragment = document.createDocumentFragment()
  this._generateBoxes(5).forEach(function (item) {
    fragment.appendChild(item)
  })

  var dummy = document.createElement('div')
  dummy.className = "row"
  dummy.appendChild(fragment)
  return dummy.innerHTML
};

/**
 * Create some DOM elements, append them to the shuffle container, then notify
 * shuffle about the new items. You could also insert the HTML as a string.
 */
Dynamic.prototype.onAppendBoxes = function () {
  var elements = this._getArrayOfElementsToAdd()

  elements.forEach(function (element) {
    this.shuffle.element.appendChild(element)
  }, this)

  // Tell shuffle items have been appended.
  // It expects an array of elements as the parameter.
  this.shuffle.add(elements)
}

Dynamic.prototype.bindButton = function(){
  document.querySelector('#allocate').addEventListener('click', this.allocateNext.bind(this))
  document.querySelector('#merge').addEventListener('click', this.mergeNext.bind(this))
  document.querySelector('#back').addEventListener('click', this.backOnce.bind(this))
  document.querySelector('#consistent').addEventListener('click', this.consistentNext.bind(this))
}

Dynamic.prototype.generateMemBlock = function(itemsToCreate){
  var box = document.createElement('div')
  box.className = 'box col-md-12 border border-dark rounded'
  if(itemsToCreate.used == dynamicAlloc.memStatus.FREE){
    box.style.backgroundColor = "rgb(256,256,256)"
    box.innerHTML = "<p>Free " + itemsToCreate.length +"K</p>"
  }
  else{
    var jobID = itemsToCreate.jobID
    var newColor = "rgb(256,256,256)"
    // console.log(colorBox)
    for(var index in colorBox){
      if(colorBox[index][0] == jobID){
        newColor = colorBox[index][1]
        console.log(newColor)
        break
      }
    }
    box.style.backgroundColor = newColor
    box.innerHTML = "<p>给作业" + itemsToCreate.jobID + "分配的" + itemsToCreate.length + "K</p>"
    box.style.color = "white"
  }
  box.style.height = itemsToCreate.length + "px"
  box.style.padding = '1px'
  box.style.fontSize = 'small'
  return box
}

Dynamic.prototype.refreshFree = function(){
  var free = this.mem.freeList
  var all = free
  if(this.mem.allocateMethod == dynamicAlloc.allMethod.FIRSTFIT){
    all = all.sort(dynamicAlloc.freeSortFirstFit)
  }
  else{
    all = all.sort(dynamicAlloc.freeSortBestFit)
  }
  var elements = []
  all.forEach(function(block){
    var element = Dynamic.prototype.generateMemBlock(block)
    this.shuffle.element.appendChild(element)
    elements.push(element)
  }, this)
  this.shuffle.add(elements)
}

Dynamic.prototype.refreshMem = function(){
  var allocated = this.mem.memoryList
  var free = this.mem.freeList
  var all = []
  all = all.concat(allocated, free)
  all = all.sort(dynamicAlloc.blockSort)
  var elements = []
  all.forEach(function(block){
    var element = Dynamic.prototype.generateMemBlock(block)
    this.shuffle.element.appendChild(element)
    elements.push(element)
  }, this)
  this.shuffle.add(elements)
}

Dynamic.prototype.initMem = function(){
  this.mem = new dynamicAlloc.Memory()
  this.refreshMem()
}

Dynamic.prototype.removeAll = function(){
  var total = this.shuffle.visibleItems
  if (!total) {
    return
  }
  var indiciesToRemove = []
  for (var i = 0; i < total; i++) {
    indiciesToRemove.push(i);
  }

  // Make an array of elements to remove.
  var collection = indiciesToRemove.map(function (index) {
    return this.shuffle.items[index].element;
  }, this);

  // Tell shuffle to remove them
  this.shuffle.remove(collection);
}

Dynamic.prototype.allocateNext = function(){
  //add cache support
  if(programStep > nowStep){
    var nowCache = window.cache[nowStep + 1][0]
    this.mem = nowCache
    window.freedynamic.mem = this.mem
    this.removeAll()
    this.refreshMem()
  }
  else{
    var nowProgram = program[nowStep]
    console.log(nowProgram)
    if(nowProgram[2] == 'add'){
      var newBlock = new dynamicAlloc.MemoryBlock(nowProgram[1])
      newBlock.jobID = nowProgram[0]
      this.mem.allocate(newBlock)
      this.removeAll()
      this.refreshMem()
    }
    else{
      var jobID = nowProgram[0]
      var length = nowProgram[1]
      for(var index in this.mem.memoryList){
        var now = this.mem.memoryList[index]
        if(now.jobID == jobID && now.length == length){
          this.mem.retrieveFree(now)
          this.removeAll()
          this.refreshMem()
          break
        }
      }
    }
  }
  if(nowStep > 0){
    document.getElementById("back").disabled = false
  }
  document.getElementById('allocate').disabled = true
  document.getElementById('merge').disabled = false
  document.getElementById('back').disabled = true

  window.freedynamic.removeAll()
  window.freedynamic.refreshFree()
}

Dynamic.prototype.mergeNext = function(){
  if(nowStep == program.length - 1){
    document.getElementById('allocate').disabled = true
    document.getElementById('consistent').disabled = true
  }
  else{
    document.getElementById('allocate').disabled = false
  }
  document.getElementById('merge').disabled = true
  document.getElementById('back').disabled = false
  if(programStep == nowStep){
    var temp = deepCloneMem(this.mem)
    this.mem.merge()
    window.cache.push([temp, deepCloneMem(this.mem)])
  }
  else{
    var oldMem = window.cache[nowStep + 1][1]
    this.mem = oldMem
    window.freedynamic.mem = this.mem
  }
  if(programStep > nowStep){
    nowStep = nowStep + 1
  }
  else{
    nowStep = nowStep + 1
    programStep = programStep + 1
  }
  this.removeAll()
  this.refreshMem()
  window.freedynamic.removeAll()
  window.freedynamic.refreshFree()
}

Dynamic.prototype.backOnce = function(){
  if(nowStep - 1 >=0){
    console.log("back")
    nowStep = nowStep - 1
    console.log(window.cache)
    var nowCache = window.cache[nowStep][0]
    this.mem = nowCache
    window.freedynamic.mem = this.mem
    this.removeAll()
    this.refreshMem()
  }
  if(nowStep == 0){
    document.getElementById('back').disabled = true
  }
  document.getElementById('allocate').disabled = false
  document.getElementById('merge').disabled = true
  document.getElementById('consistent').disabled = false
  window.freedynamic.removeAll()
  window.freedynamic.refreshFree()
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

Dynamic.prototype.consistentNext = async function(){
  for(var step = 0; step < program.length; step++){
    this.allocateNext()
    document.getElementById('allocate').disabled = true
    document.getElementById('merge').disabled = true
    window.freedynamic.removeAll()
    window.freedynamic.refreshFree()
    await sleep(1000)
    
    this.mergeNext()
    document.getElementById('allocate').disabled = true
    document.getElementById('merge').disabled = true
    window.freedynamic.removeAll()
    window.freedynamic.refreshFree()
    await sleep(1000)
  }
}

Dynamic.prototype.nextStep = function(){
  
}

//freedynamic refresh
document.addEventListener('DOMContentLoaded', function(){
  window.cache = []
  window.dynamic = new Dynamic(document.getElementById('my-shuffle'))
  window.freedynamic = new Dynamic(document.getElementById('free-shuffle'))
  window.dynamic.initMem()
  window.freedynamic.initMem()
  window.freedynamic.mem = window.dynamic.mem
  window.cache.push([deepCloneMem(window.dynamic.mem), deepCloneMem(window.dynamic.mem)])
  window.dynamic.bindButton()
  document.getElementById("back").disabled = true
  document.getElementById('allocate').disabled = false
  document.getElementById('merge').disabled = true
  $('.form-check-input').on('click', function () {
    console.log($(this).val())
    var value = $(this).val()
    if(value == 'bestfit'){
      window.dynamic.removeAll()
      window.freedynamic.removeAll()
      window.cache = []
      window.dynamic.initMem()
      window.freedynamic.initMem()
      window.freedynamic.mem = window.dynamic.mem
      window.dynamic.mem.setMethod('Bestfit')
      window.cache.push([deepCloneMem(window.dynamic.mem), deepCloneMem(window.dynamic.mem)])
      programStep = 0
      nowStep = 0
      document.getElementById("back").disabled = true
      document.getElementById('allocate').disabled = false
      document.getElementById('merge').disabled = true
    }
    else{
      window.dynamic.removeAll()
      window.freedynamic.removeAll()
      window.dynamic.initMem()
      window.freedynamic.initMem()
      window.freedynamic.mem = window.dynamic.mem
      window.dynamic.mem.setMethod('Firstfit')
      window.cache = []
      window.cache.push([deepCloneMem(window.dynamic.mem), deepCloneMem(window.dynamic.mem)])
      programStep = 0
      nowStep = 0
      document.getElementById("back").disabled = true
      document.getElementById('allocate').disabled = false
      document.getElementById('merge').disabled = true
    }
  })
})
