class HashMap {
  constructor(initialCapacity = 8) {
    this.length = 0;
    this._slots = [];
    this._capacity = initialCapacity;
    this._deleted = 0;
  }

  get(key) {
    const index = this._findSlot(key);
    if (this._slots[index] === undefined) {
      throw new Error('Key error');
    }
    return this._slots[index].value;
  }

  set(key, value) {
    const loadRatio = (this.length + this._deleted + 1) / this._capacity;
    if (loadRatio > HashMap.MAX_LOAD_RATIO) {
      this._resize(this._capacity * HashMap.SIZE_RATIO);
    }

    const index = this._findSlot(key);
    if (!this._slots[index]) {
      this.length++;
    }
    this._slots[index] = {
      key,
      value,
      deleted: false
    };
  }

  remove(key) {
    const index = this._findSlot(key);
    const slot = this._slots[index];
    if (slot === undefined) {
      throw new Error('Key error');
    }
    slot.deleted = true;
    this.length--;
    this._deleted++;
  }

  _findSlot(key) {
    const hash = HashMap._hashString(key);
    const start = hash % this._capacity;

    for (let i = start; i < start + this._capacity; i++) {
      const index = i % this._capacity;
      const slot = this._slots[index];
      if (slot === undefined || (slot.key === key && !slot.deleted)) {
        return index;
      }
    }
  }

  _resize(size) {
    const oldSlots = this._slots;
    this._capacity = size;
    // Reset the length - it will get rebuilt as you add the items back
    this.length = 0;
    this._deleted = 0;
    this._slots = [];

    for (const slot of oldSlots) {
      if (slot !== undefined && !slot.deleted) {
        this.set(slot.key, slot.value);
      }
    }
  }

  static _hashString(string) {
    let hash = 5381;
    for (let i = 0; i < string.length; i++) {
      hash = (hash << 5) + hash + string.charCodeAt(i);
      hash = hash & hash;
    }
    return hash >>> 0;
  }
}

HashMap.MAX_LOAD_RATIO = 0.9;
HashMap.SIZE_RATIO = 3;

function palindrome(str) {
  const word = new HashMap();
  let odd = 0;
  let unique = '';
  for (let i = 0; i < str.length; i++) {
    let letter = str[i];
    try {
      let val = word.get(letter);
      word.set(letter, val+=1);
    } catch(err) {
      unique += letter;
      word.set(letter, 1);
    }
  }

  for (let i = 0; i < unique.length; i++) {
    if (word.get(unique[i]) % 2 !== 0) {
      odd++;
    }
  }
  if (odd > 1) {
    return false;
  }
  return true;
}

function anagram(arr) {
  let anagrams = new HashMap();
  let unique = [];
  let result = [];
  for (let i = 0; i < arr.length; i++) {
    let sorted = arr[i].split('').sort().join('');
    try {
      let val = anagrams.get(sorted);
      anagrams.set(sorted, [...val, arr[i]]);
    } catch(err) {
      unique.push(sorted);
      anagrams.set(sorted, [arr[i]]);
    }
  }
  for (let i = 0; i < unique.length; i++) {
    result.push(anagrams.get(unique[i]));
  }
  return result;
}

function main() {
  // let lor = new HashMap();
  // lor.set('Hobbit', 'Bilbo');
  // lor.set('Hobbit', 'Frodo');
  // lor.set('Wizard', 'Gandolf');
  // lor.set('Human', 'Aragon');
  // lor.set('Elf', 'Legolas');
  // lor.set('Maiar', 'The Necromancer');
  // lor.set('Maiar', 'Sauron');
  // lor.set('RingBearer', 'Gollum');
  // lor.set('LadyOfLight', 'Galadriel');
  // lor.set('HalfEleven', 'Arwen');
  // lor.set('Ent', 'Treebeard');
  // console.log(lor);
  // console.log(lor.get('Maiar'));
  // console.log(palindrome('rraacce'))
  console.log(anagram(['east', 'cars', 'acre', 'arcs', 'teas', 'eats', 'race']))
}
main();