interface PaginationInterface<T> {
  count: number
  rows: T[]
}

export class Pagination {
  page: number
  limit: number
  offset: number

  constructor(page: number | string, size: number | string) {
    // pastikan page selalu minimal 1
    const parsedPage = parseInt(page as string)
    this.page = parsedPage > 0 ? parsedPage : 1

    const parsedSize = parseInt(size as string)
    this.limit = parsedSize > 0 ? parsedSize : 10

    this.offset = (this.page - 1) * this.limit
  }

  /**
   * Paginate the data based on the provided pagination interface.
   * Adds automatic numbering for each item.
   * @param data - The data to paginate, which includes count and rows.
   * @returns An object containing pagination details.
   */
  paginate<T extends object>(data: PaginationInterface<T>): any {
    const totalPages = Math.ceil(data.count / this.limit)

    // tambahkan nomor urut otomatis untuk setiap item
    const itemsWithIndex = data.rows.map((item, index) => ({
      no: this.offset + index + 1,
      ...item,
    }))

    return {
      total_items: data.count,
      total_pages: totalPages,
      current_page: this.page,
      limit: this.limit,
      items: itemsWithIndex,
      links: {
        prev:
          this.page > 1 ? `?page=${this.page - 1}&limit=${this.limit}` : null,
        next:
          this.page < totalPages
            ? `?page=${this.page + 1}&limit=${this.limit}`
            : null,
      },
    }
  }
}
