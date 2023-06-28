"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelManager = void 0;
const fs = __importStar(require("fs/promises"));
class ModelManager {
    constructor(filePath) {
        this.filePath = filePath;
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let itemsTxt = yield fs.readFile(this.filePath, "utf8");
                let items = JSON.parse(itemsTxt);
                return items;
            }
            catch (err) {
                if (err.code === "ENOENT") {
                    // file does not exits
                    yield this.save([]); // create a new file with ampty array
                    return []; // return empty array
                } // // cannot handle this exception, so rethrow
                else
                    throw err;
            }
        });
    }
    // save array of items to file
    save(items = []) {
        return __awaiter(this, void 0, void 0, function* () {
            let itemsTxt = JSON.stringify(items);
            yield fs.writeFile(this.filePath, itemsTxt);
        });
    }
    // test function for item ID
    findItem(itemArray, Id) {
        return itemArray.findIndex((currItem) => currItem.id === Id);
    }
    // create a new item
    add(newItem) {
        return __awaiter(this, void 0, void 0, function* () {
            let itemArray = yield this.getAll();
            if (this.findItem(itemArray, newItem.id) !== -1)
                throw new Error(`Item with Id:${newItem.id} already exists`);
            itemArray.push(newItem);
            yield this.save(itemArray);
        });
    }
    // get gustomer by ID
    getByID(itemId) {
        return __awaiter(this, void 0, void 0, function* () {
            let itemArray = yield this.getAll();
            let index = this.findItem(itemArray, itemId);
            if (index === -1)
                throw new Error(`Item with ID:${itemId} doesn't exist`);
            else
                return itemArray[index];
        });
    }
    // update existing item
    update(itemId, item) {
        return __awaiter(this, void 0, void 0, function* () {
            let itemArray = yield this.getAll();
            let index = this.findItem(itemArray, itemId); // findIndex
            if (index === -1)
                throw new Error(`Item with ID:${itemId} doesn't exist`);
            else {
                itemArray[index] = item;
                yield this.save(itemArray);
            }
        });
    }
}
exports.ModelManager = ModelManager;
//# sourceMappingURL=model-manager.js.map