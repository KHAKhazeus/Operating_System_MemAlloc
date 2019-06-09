/* eslint-disable */
var totalLength = 640

const memStatus = {
    ALLOCATED: true,
    FREE: false
}

const allMethod = {
    FIRSTFIT : 1,
    BESTFIT : 2
}

function blockSort(a, b){
    return a.start - b.start
}

function freeSortFirstFit(a, b){
    return a.start - b.start
}

function freeSortBestFit(a, b){
    return a.length - b.length
}


class Memory{
    constructor(){
        this.memoryList = []
        this.allocateMethod = allMethod.FIRSTFIT
        var firstFree = new MemoryBlock(totalLength)
        firstFree.start = 1
        firstFree.end = 640
        this.freeList = [firstFree]
    }
    allocate(block){
        if(this.allocateMethod == allMethod.FIRSTFIT){
            this.freeList = this.freeList.sort(freeSortFirstFit)
            if(this.freeList.length > 0){
                for(var index in this.freeList){
                    var nowFree = this.freeList[index]
                    if(nowFree.length >= block.length){
                        block.start = nowFree.start
                        block.end = block.start + block.length - 1
                        block.used = memStatus.ALLOCATED
                        this.memoryList.push(block)
                        this.memoryList = this.memoryList.sort(blockSort)
                        nowFree.start = block.end + 1
                        nowFree.length = nowFree.end - nowFree.start + 1
                        if(nowFree.length == 0){
                            this.freeList.splice(index, 1)
                        }
                        this.freeList = this.freeList.sort(freeSortFirstFit)
                        break
                    }
                }
                if(block.used == memStatus.FREE){
                    return false
                }
                else{
                    return true
                }
            }
            else{
                return false
            }
        }
        else{
            if(this.freeList.length > 0){
                this.freeList = this.freeList.sort(freeSortBestFit)
                for(var index in this.freeList){
                    var nowFree = this.freeList[index]
                    if(nowFree.length >= block.length){
                        block.start = nowFree.start
                        block.end = block.start + block.length - 1
                        block.used = memStatus.ALLOCATED
                        this.memoryList.push(block)
                        this.memoryList = this.memoryList.sort(blockSort)
                        nowFree.start = block.end + 1
                        nowFree.length = nowFree.end - nowFree.start + 1
                        if(nowFree.length == 0){
                            this.freeList.splice(index, 1)
                        }
                        this.freeList = this.freeList.sort(freeSortBestFit)
                        break
                    }
                }
                if(block.used == memStatus.FREE){
                    return false
                }
                else{
                    return true
                }
            }
            else{
                return false
            }
        }
    }
    setMethod(methodString){
        if(methodString == "Firstfit"){
            this.allocateMethod = allMethod.FIRSTFIT
        }
        else if(methodString == "Bestfit"){
            this.allocateMethod = allMethod.BESTFIT
        }
    }
    retrieveFree(block){
        //free this block
        block.used = memStatus.FREE
        block.jobID = 0
        this.memoryList.splice(this.memoryList.indexOf(block), 1)
        this.freeList.push(block)
        if(this.allocateMethod == allMethod.FIRSTFIT){
            this.freeList = this.freeList.sort(freeSortFirstFit)
        }
        else{
            this.freeList = this.freeList.sort(freeSortBestFit)
        }
    }
    merge(){
        this.freeList = this.freeList.sort(blockSort)
        if(this.freeList.length > 0){
            for(var index = 0; index < this.freeList.length; index++){
                console.log(index)
                if(index + 1 == this.freeList.length){
                    break
                }
                var now = this.freeList[index]
                var next = this.freeList[index + 1]
                if(next.start - now.end == 1){
                    now.end = next.end
                    now.length = now.end - now.start + 1
                    this.freeList.splice(index + 1, 1)
                    console.log(index + 1, "merged")
                }
            }
        }
        if(this.allocateMethod == allMethod.FIRSTFIT){
            this.freeList = this.freeList.sort(freeSortFirstFit)
        }
        else{
            this.freeList = this.freeList.sort(freeSortBestFit)
        }
    }
}

class MemoryBlock{
    constructor(memoryLength){
        this.length = memoryLength
        this.start = -1
        this.end = -1
        this.used = memStatus.FREE
        this.jobID = 0
    }
}

export {totalLength, memStatus, allMethod, blockSort, freeSortBestFit, freeSortFirstFit, Memory, MemoryBlock}

