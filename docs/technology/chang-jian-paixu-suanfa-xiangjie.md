---
title: 常见排序算法详解
date: 2026-01-12
tags:
  - 算法
  - 排序
  - 数据结构
categories:
  - IT
---
## 前言

排序算法是计算机科学中最基础的算法之一。本文详细介绍常见的排序算法，包括冒泡排序、选择排序、插入排序、快速排序、归并排序等。

## 冒泡排序（Bubble Sort）

### 原理

重复遍历数组，比较相邻元素并交换位置，最大元素逐渐"冒泡"到末尾。

### 实现

```javascript
function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}
```

### 优化版本

```javascript
function bubbleSortOptimized(arr) {
  const n = arr.length;
  for (let i = 0; i < n; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    // 如果没有交换，说明已排序完成
    if (!swapped) break;
  }
  return arr;
}
```

### 复杂度

- 时间复杂度：O(n²)（最坏/平均），O(n)（最好）
- 空间复杂度：O(1)

## 选择排序（Selection Sort）

### 原理

在未排序部分找到最小元素，放到已排序部分末尾。

### 实现

```javascript
function selectionSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
  }
  return arr;
}
```

### 复杂度

- 时间复杂度：O(n²)
- 空间复杂度：O(1)

## 插入排序（Insertion Sort）

### 原理

将数组分为已排序和未排序两部分，逐个处理未排序元素插入到正确位置。

### 实现

```javascript
function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}
```

### 复杂度

- 时间复杂度：O(n²)（最坏/平均），O(n)（最好）
- 空间复杂度：O(1)
- 特点：对于小规模数据或基本有序的数据效率高

## 快速排序（Quick Sort）

### 原理

选择一个基准元素，将数组分为小于基准和大于基准的两部分，递归排序。

### 实现

```javascript
function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
  return arr;
}

function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;
  
  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}
```

### 复杂度

- 时间复杂度：O(n log n)（平均），O(n²)（最坏）
- 空间复杂度：O(log n)
- 特点：原地排序，平均性能优秀

## 归并排序（Merge Sort）

### 原理

采用分治思想，将数组递归拆分后合并。

### 实现

```javascript
function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  
  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }
  
  return result.concat(left.slice(i)).concat(right.slice(j));
}
```

### 复杂度

- 时间复杂度：O(n log n)
- 空间复杂度：O(n)
- 特点：稳定排序，适合大规模数据

## 堆排序（Heap Sort）

### 原理

利用堆数据结构进行排序。

### 实现

```javascript
function heapSort(arr) {
  const n = arr.length;
  
  // 构建最大堆
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }
  
  // 提取元素
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }
  
  return arr;
}

function heapify(arr, n, i) {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;
  
  if (left < n && arr[left] > arr[largest]) {
    largest = left;
  }
  if (right < n && arr[right] > arr[largest]) {
    largest = right;
  }
  
  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, n, largest);
  }
}
```

### 复杂度

- 时间复杂度：O(n log n)
- 空间复杂度：O(1)

## 算法对比

| 算法 | 时间复杂度(平均) | 时间复杂度(最坏) | 空间复杂度 | 稳定性 |
|------|-----------------|-----------------|-----------|--------|
| 冒泡排序 | O(n²) | O(n²) | O(1) | 稳定 |
| 选择排序 | O(n²) | O(n²) | O(1) | 不稳定 |
| 插入排序 | O(n²) | O(n²) | O(1) | 稳定 |
| 快速排序 | O(n log n) | O(n²) | O(log n) | 不稳定 |
| 归并排序 | O(n log n) | O(n log n) | O(n) | 稳定 |
| 堆排序 | O(n log n) | O(n log n) | O(1) | 不稳定 |

## 实际使用建议

1. **小规模数据**：插入排序效率高
2. **大规模数据**：快速排序、归并排序、堆排序
3. **基本有序**：插入排序
4. **需要稳定排序**：归并排序
5. **JavaScript 内置**：`Array.sort()` 使用快速排序的改进版本
