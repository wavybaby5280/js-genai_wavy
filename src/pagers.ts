/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Pagers for the GenAI List APIs.
 */

// Type of request, response and config are determined by the specific list
// method.
/*  eslint-disable @typescript-eslint/no-explicit-any */

export enum PagedItem {
  PAGED_ITEM_BATCH_JOBS = 'batchJobs',
  PAGED_ITEM_MODELS = 'models',
  PAGED_ITEM_TUNING_JOBS = 'tuningJobs',
  PAGED_ITEM_FILES = 'files',
  PAGED_ITEM_CACHED_CONTENTS = 'cachedContents',
}

/**
 * Base pager class for iterating through paginated results.
 */
class BasePager<T> {
  private nameInternal!: PagedItem;
  private pageInternal: T[] = [];
  private paramsInternal: any;
  private pageInternalSize!: number;
  protected requestInternal!: (params: any) => any;
  protected idxInternal!: number;

  init(name: PagedItem, response: any, params: any) {
    this.nameInternal = name;
    this.pageInternal = response[this.nameInternal] || [];
    this.idxInternal = 0;
    let requestParams: any = {config: {}};
    if (!params) {
      requestParams = {config: {}};
    } else if (typeof params === 'object') {
      requestParams = {...params};
    } else {
      requestParams = params;
    }
    if (requestParams['config']) {
      requestParams['config']['pageToken'] = response['nextPageToken'];
    }
    this.paramsInternal = requestParams;
    this.pageInternalSize =
      requestParams['config']?.['pageSize'] ?? this.pageInternal.length;
  }

  constructor(
    name: PagedItem,
    request: (params: any) => any,
    response: any,
    params: any,
  ) {
    this.requestInternal = request;
    this.init(name, response, params);
  }

  /**
   * Returns the current page, which is a list of items.
   *
   * @remarks
   * The returned list of items is a subset of the entire list.
   */
  page(): T[] {
    return this.pageInternal;
  }

  /**
   * Returns the type of paged item (for example, ``batch_jobs``).
   */
  name(): PagedItem {
    return this.nameInternal;
  }

  /**
   * Returns the length of the page fetched each time by this pager.
   *
   * @remarks
   * The number of items in the page is less than or equal to the page length.
   */
  pageSize(): number {
    return this.pageInternalSize;
  }

  /**
   * Returns the parameters when making the API request for the next page.
   *
   * @remarks
   * Parameters contain a set of optional configs that can be
   * used to customize the API request. For example, the ``pageToken`` parameter
   * contains the token to request the next page.
   */
  params(): any {
    return this.paramsInternal;
  }

  /**
   * Returns the total number of items in the current page.
   */
  len(): number {
    return this.pageInternal.length;
  }

  /**
   * Returns the item at the given index.
   */
  getItem(index: number): T {
    return this.pageInternal[index];
  }

  /**
   * Initializes the next page from the response.
   *
   * @remarks
   * This is an internal method that should be called by subclasses after
   * fetching the next page.
   */
  protected initNextPage(response: any): void {
    this.init(this.nameInternal, response, this.paramsInternal);
  }
}

/**
 * Pager class for iterating through paginated results.
 */
export class Pager<T> extends BasePager<T> implements AsyncIterable<T> {
  constructor(
    name: PagedItem,
    request: (params: any) => any,
    response: any,
    params: any,
  ) {
    super(name, request, response, params);
  }

  [Symbol.asyncIterator](): AsyncIterator<T> {
    return {
      next: async () => {
        if (this.idxInternal >= this.len()) {
          try {
            await this.nextPage();
          } catch (e) {
            return {value: undefined, done: true};
          }
        }
        const item = this.getItem(this.idxInternal);
        this.idxInternal += 1;
        return {value: item, done: false};
      },
      return: async () => {
        return {value: undefined, done: true};
      },
    };
  }

  /**
   * Fetches the next page of items. This makes a new API request.
   *
   * @throws {Error} If there are no more pages to fetch.
   *
   * @example
   *
   * ```ts
   * const pager = await client.files.list({config: {pageSize: 2}});
   * let page = pager.page();
   * for (const file of pager) {
   *   console.log(file.name);
   * }
   * while (pager.hasNextPage()) {
   *   page = await pager.nextPage();
   *   for (const file of page) {
   *     console.log(file.name);
   *   }
   * }
   * ```
   */
  async nextPage(): Promise<T[]> {
    if (!this.hasNextPage()) {
      throw new Error('No more pages to fetch.');
    }
    const response = await this.requestInternal(this.params());
    this.initNextPage(response);
    return this.page();
  }

  /**
   * Returns true if there are more pages to fetch.
   */
  hasNextPage(): boolean {
    if (this.params()['config']?.['pageToken'] !== undefined) {
      return true;
    }
    return false;
  }
}
