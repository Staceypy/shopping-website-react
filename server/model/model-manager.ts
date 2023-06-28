import * as fs from "fs/promises";

export class ModelManager<T extends { id: ID_TYPE }, ID_TYPE>{
  filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath
  }

  // get gustomer by ID
  async getByID(itemId: ID_TYPE) {
    let itemArray = await this.getAll();
    let index = this.findItem(itemArray, itemId);
    if (index === -1)
      throw new Error(`Model-Manager; Item with ID:${itemId} doesn't exist`);
    else return itemArray[index];
  }

  //helper function
  async getAll(): Promise<T[]> {
    try {
      let itemsTxt = await fs.readFile(this.filePath, "utf8");
      let items = JSON.parse(itemsTxt) as T[];
      return items;
    } catch (err:any) {
      if (err.code === "ENOENT") {
        // file does not exits
        //await this.save([]); // create a new file with ampty array
        
        return []; // return empty array
      } // // cannot handle this exception, so rethrow
      else throw err;
    }
  }

    // test function for item ID //helper function
    findItem(itemArray: T[], Id: ID_TYPE) {
      return itemArray.findIndex(
        (currItem) => currItem.id === Id
      );
    }
  
  // save array of items to file //helper function
  async save(items: T[] = []) {
    let itemsTxt = JSON.stringify(items);
    await fs.writeFile(this.filePath, itemsTxt);
  }

  // create a new item
  async add(newItem: T) {
    let itemArray = await this.getAll();
    if (this.findItem(itemArray, newItem.id) !== -1)
      throw new Error(
        `Item with Id:${newItem.id} already exists`
      );
    itemArray.push(newItem);
    await this.save(itemArray);
  }

    // update existing item
    async update(itemId: ID_TYPE, item: T) {
      let itemArray = await this.getAll();
      let index = this.findItem(itemArray, itemId); // findIndex
      if (index === -1)
        throw new Error(`Item with ID:${itemId} doesn't exist`);
      else {
        itemArray[index] = item;
        await this.save(itemArray);
      }
    }
  
    // delete existing item
    async remove(itemId: ID_TYPE) {
      let itemArray = await this.getAll();
      let index = this.findItem(itemArray, itemId); // findIndex
      if (index === -1)
        throw new Error(`Item with ID:${itemId} doesn't exist`);
      else {
        itemArray.splice(index, 1); // remove item from array
        await this.save(itemArray);
      }
    }
  }


