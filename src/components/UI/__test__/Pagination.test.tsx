import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Pagination from '../../Pagination'
import type { PaginationProps } from '../../types'

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  ChevronLeft: ({ className }: any) => <div className={`lucide-chevron-left ${className}`} data-testid="chevron-left" />,
  ChevronRight: ({ className }: any) => <div className={`lucide-chevron-right ${className}`} data-testid="chevron-right" />,
}))

describe('Pagination Component', () => {
  const defaultProps: PaginationProps = {
    currentPage: 1,
    totalPages: 10,
    onPageChange: vi.fn(),
    loading: false,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  const renderPagination = (props: Partial<PaginationProps> = {}) => {
    return render(<Pagination {...defaultProps} {...props} />)
  }

  describe('Rendering and Visibility', () => {
    it('renders pagination when totalPages > 1', () => {
      renderPagination({ totalPages: 5 })
      
      expect(screen.getByText('Previous')).toBeInTheDocument()
      expect(screen.getByText('Next')).toBeInTheDocument()
      expect(screen.getByText('1')).toBeInTheDocument()
    })

    it('does not render when totalPages <= 1', () => {
      const { container } = renderPagination({ totalPages: 1 })
      
      expect(container.firstChild).toBeNull()
    })

    it('does not render when totalPages is 0', () => {
      const { container } = renderPagination({ totalPages: 0 })
      
      expect(container.firstChild).toBeNull()
    })

    it('has correct structure with proper CSS classes', () => {
      renderPagination()
      
      const container = screen.getByRole('button', { name: /previous/i }).closest('div')
      expect(container).toHaveClass('flex', 'items-center', 'justify-center', 'space-x-2', 'mt-8')
    })
  })

  describe('Navigation Buttons', () => {
    it('renders Previous button with correct styling', () => {
      renderPagination()
      
      const previousBtn = screen.getByRole('button', { name: /previous/i })
      expect(previousBtn).toBeInTheDocument()
      expect(previousBtn).toHaveClass(
        'px-3',
        'py-2',
        'border',
        'border-gray-300',
        'rounded-md',
        'text-gray-700',
        'hover:bg-blue-600',
        'hover:text-white',
        'disabled:opacity-50',
        'disabled:cursor-not-allowed',
        'transition-colors',
        'duration-200',
        'flex',
        'items-center'
      )
      expect(screen.getByTestId('chevron-left')).toBeInTheDocument()
    })

    it('renders Next button with correct styling', () => {
      renderPagination()
      
      const nextBtn = screen.getByRole('button', { name: /next/i })
      expect(nextBtn).toBeInTheDocument()
      expect(nextBtn).toHaveClass(
        'px-3',
        'py-2',
        'border',
        'border-gray-300',
        'rounded-md',
        'text-gray-700',
        'hover:bg-gray-50',
        'disabled:opacity-50',
        'disabled:cursor-not-allowed',
        'transition-colors',
        'duration-200',
        'flex',
        'items-center'
      )
      expect(screen.getByTestId('chevron-right')).toBeInTheDocument()
    })

    it('Previous button is disabled on first page', () => {
      renderPagination({ currentPage: 1, totalPages: 5 })
      
      const previousBtn = screen.getByRole('button', { name: /previous/i })
      expect(previousBtn).toBeDisabled()
    })

    it('Previous button is enabled when not on first page', () => {
      renderPagination({ currentPage: 3, totalPages: 5 })
      
      const previousBtn = screen.getByRole('button', { name: /previous/i })
      expect(previousBtn).toBeEnabled()
    })

    it('Next button is disabled on last page', () => {
      renderPagination({ currentPage: 5, totalPages: 5 })
      
      const nextBtn = screen.getByRole('button', { name: /next/i })
      expect(nextBtn).toBeDisabled()
    })

    it('Next button is enabled when not on last page', () => {
      renderPagination({ currentPage: 3, totalPages: 5 })
      
      const nextBtn = screen.getByRole('button', { name: /next/i })
      expect(nextBtn).toBeEnabled()
    })
  })

  describe('Page Numbers', () => {
    it('shows current page with active styling', () => {
      renderPagination({ currentPage: 3, totalPages: 10 })
      
      const currentPageBtn = screen.getByRole('button', { name: '3' })
      expect(currentPageBtn).toHaveClass('bg-blue-600', 'text-white', 'border-blue-600')
    })

    it('shows non-current pages with default styling', () => {
      renderPagination({ currentPage: 3, totalPages: 10 })
      
      const pageBtn = screen.getByRole('button', { name: '2' })
      expect(pageBtn).toHaveClass('border-gray-300', 'text-gray-700', 'hover:bg-gray-50')
      expect(pageBtn).not.toHaveClass('bg-blue-600', 'text-white')
    })

    it('always shows first page', () => {
      renderPagination({ currentPage: 5, totalPages: 10 })
      
      expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument()
    })

    it('always shows last page', () => {
      renderPagination({ currentPage: 5, totalPages: 10 })
      
      expect(screen.getByRole('button', { name: '10' })).toBeInTheDocument()
    })
  })

  describe('Ellipsis Display', () => {
    it('shows ellipsis when there are gaps in page numbers', () => {
      renderPagination({ currentPage: 8, totalPages: 15 })
      
      const ellipses = screen.getAllByText('...')
      expect(ellipses.length).toBeGreaterThan(0)
    })

    it('ellipsis have correct styling', () => {
      renderPagination({ currentPage: 8, totalPages: 15 })
      
      const ellipsis = screen.getAllByText('...')[0]
      expect(ellipsis).toHaveClass('px-3', 'py-2', 'text-gray-500')
    })

    it('does not show ellipsis when not needed', () => {
      renderPagination({ currentPage: 2, totalPages: 5 })
      
      expect(screen.queryByText('...')).not.toBeInTheDocument()
    })
  })

  describe('Visible Pages Logic', () => {
    it('shows correct pages for small total pages', () => {
      renderPagination({ currentPage: 2, totalPages: 3 })
      
      expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument()
    })

    it('shows correct pages for beginning range', () => {
      renderPagination({ currentPage: 2, totalPages: 10 })
      
      expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '4' })).toBeInTheDocument()
    })

    it('shows correct pages for middle range', () => {
      renderPagination({ currentPage: 5, totalPages: 10 })
      
      expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '4' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '5' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '6' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '7' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '10' })).toBeInTheDocument()
    })

    it('shows correct pages for end range', () => {
      renderPagination({ currentPage: 9, totalPages: 10 })
      
      expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '7' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '8' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '9' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '10' })).toBeInTheDocument()
    })
  })

  describe('Loading State', () => {
    it('disables Previous button when loading', () => {
      renderPagination({ currentPage: 3, totalPages: 5, loading: true })
      
      const previousBtn = screen.getByRole('button', { name: /previous/i })
      expect(previousBtn).toBeDisabled()
    })

    it('disables Next button when loading', () => {
      renderPagination({ currentPage: 3, totalPages: 5, loading: true })
      
      const nextBtn = screen.getByRole('button', { name: /next/i })
      expect(nextBtn).toBeDisabled()
    })

    it('disables all page number buttons when loading', () => {
      renderPagination({ currentPage: 3, totalPages: 5, loading: true })
      
      const pageButtons = screen.getAllByRole('button').filter(btn => 
        /^\d+$/.test(btn.textContent || '')
      )
      
      pageButtons.forEach(btn => {
        expect(btn).toBeDisabled()
      })
    })

    it('enables buttons when not loading', () => {
      renderPagination({ currentPage: 3, totalPages: 5, loading: false })
      
      const nextBtn = screen.getByRole('button', { name: /next/i })
      const previousBtn = screen.getByRole('button', { name: /previous/i })
      const pageBtn = screen.getByRole('button', { name: '2' })
      
      expect(nextBtn).toBeEnabled()
      expect(previousBtn).toBeEnabled()
      expect(pageBtn).toBeEnabled()
    })
  })

  describe('Event Handling', () => {
    it('calls onPageChange when Previous button is clicked', () => {
      const handlePageChange = vi.fn()
      renderPagination({ currentPage: 3, totalPages: 5, onPageChange: handlePageChange })
      
      const previousBtn = screen.getByRole('button', { name: /previous/i })
      fireEvent.click(previousBtn)
      
      expect(handlePageChange).toHaveBeenCalledWith(2)
      expect(handlePageChange).toHaveBeenCalledTimes(1)
    })

    it('calls onPageChange when Next button is clicked', () => {
      const handlePageChange = vi.fn()
      renderPagination({ currentPage: 3, totalPages: 5, onPageChange: handlePageChange })
      
      const nextBtn = screen.getByRole('button', { name: /next/i })
      fireEvent.click(nextBtn)
      
      expect(handlePageChange).toHaveBeenCalledWith(4)
      expect(handlePageChange).toHaveBeenCalledTimes(1)
    })

    it('calls onPageChange when page number is clicked', () => {
      const handlePageChange = vi.fn()
      renderPagination({ currentPage: 1, totalPages: 5, onPageChange: handlePageChange })
      
      const pageBtn = screen.getByRole('button', { name: '3' })
      fireEvent.click(pageBtn)
      
      expect(handlePageChange).toHaveBeenCalledWith(3)
      expect(handlePageChange).toHaveBeenCalledTimes(1)
    })

    it('does not call onPageChange when disabled buttons are clicked', () => {
      const handlePageChange = vi.fn()
      renderPagination({ currentPage: 1, totalPages: 5, onPageChange: handlePageChange })
      
      const previousBtn = screen.getByRole('button', { name: /previous/i })
      fireEvent.click(previousBtn)
      
      expect(handlePageChange).not.toHaveBeenCalled()
    })

    it('does not call onPageChange when loading', () => {
      const handlePageChange = vi.fn()
      renderPagination({ 
        currentPage: 3, 
        totalPages: 5, 
        onPageChange: handlePageChange,
        loading: true 
      })
      
      const pageBtn = screen.getByRole('button', { name: '2' })
      fireEvent.click(pageBtn)
      
      expect(handlePageChange).not.toHaveBeenCalled()
    })
  })

  describe('Accessibility', () => {
    it('has proper button roles', () => {
      renderPagination({ currentPage: 3, totalPages: 5 })
      
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
      
      buttons.forEach(button => {
        expect(button).toBeInTheDocument()
      })
    })

    it('maintains focus behavior', () => {
      renderPagination({ currentPage: 3, totalPages: 5 })
      
      const nextBtn = screen.getByRole('button', { name: /next/i })
      nextBtn.focus()
      
      expect(nextBtn).toHaveFocus()
    })

    it('disabled buttons cannot receive focus', () => {
      renderPagination({ currentPage: 1, totalPages: 5 })
      
      const previousBtn = screen.getByRole('button', { name: /previous/i })
      previousBtn.focus()
      
      expect(previousBtn).not.toHaveFocus()
    })
  })

  describe('Edge Cases', () => {
    it('handles currentPage = 1 correctly', () => {
      renderPagination({ currentPage: 1, totalPages: 10 })
      
      const previousBtn = screen.getByRole('button', { name: /previous/i })
      const nextBtn = screen.getByRole('button', { name: /next/i })
      const currentPageBtn = screen.getByRole('button', { name: '1' })
      
      expect(previousBtn).toBeDisabled()
      expect(nextBtn).toBeEnabled()
      expect(currentPageBtn).toHaveClass('bg-blue-600', 'text-white')
    })

    it('handles currentPage = totalPages correctly', () => {
      renderPagination({ currentPage: 5, totalPages: 5 })
      
      const previousBtn = screen.getByRole('button', { name: /previous/i })
      const nextBtn = screen.getByRole('button', { name: /next/i })
      const currentPageBtn = screen.getByRole('button', { name: '5' })
      
      expect(previousBtn).toBeEnabled()
      expect(nextBtn).toBeDisabled()
      expect(currentPageBtn).toHaveClass('bg-blue-600', 'text-white')
    })

    it('handles totalPages = 2 correctly', () => {
      renderPagination({ currentPage: 1, totalPages: 2 })
      
      expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument()
      expect(screen.queryByText('...')).not.toBeInTheDocument()
    })

    it('handles large totalPages correctly', () => {
      renderPagination({ currentPage: 50, totalPages: 100 })
      
      expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '100' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '50' })).toBeInTheDocument()
      expect(screen.getAllByText('...').length).toBeGreaterThan(0)
    })
  })

  describe('Complex Scenarios', () => {
    it('handles navigation through multiple pages', () => {
      const handlePageChange = vi.fn()
      renderPagination({ currentPage: 5, totalPages: 10, onPageChange: handlePageChange })
      
      // Click Previous
      fireEvent.click(screen.getByRole('button', { name: /previous/i }))
      expect(handlePageChange).toHaveBeenCalledWith(4)
      
      // Click Next
      fireEvent.click(screen.getByRole('button', { name: /next/i }))
      expect(handlePageChange).toHaveBeenCalledWith(6)
      
      // Click specific page
      fireEvent.click(screen.getByRole('button', { name: '3' }))
      expect(handlePageChange).toHaveBeenCalledWith(3)
      
      expect(handlePageChange).toHaveBeenCalledTimes(3)
    })

    it('handles loading state transitions', () => {
      const { rerender } = renderPagination({ 
        currentPage: 3, 
        totalPages: 5, 
        loading: false 
      })
      
      const nextBtn = screen.getByRole('button', { name: /next/i })
      expect(nextBtn).toBeEnabled()
      
      // Switch to loading
      rerender(<Pagination 
        currentPage={3} 
        totalPages={5} 
        onPageChange={vi.fn()} 
        loading={true} 
      />)
      
      expect(nextBtn).toBeDisabled()
    })

    it('handles currentPage updates correctly', () => {
      const { rerender } = renderPagination({ currentPage: 1, totalPages: 5 })
      
      let currentPageBtn = screen.getByRole('button', { name: '1' })
      expect(currentPageBtn).toHaveClass('bg-blue-600')
      
      // Update current page
      rerender(<Pagination 
        currentPage={3} 
        totalPages={5} 
        onPageChange={vi.fn()} 
        loading={false} 
      />)
      
      currentPageBtn = screen.getByRole('button', { name: '3' })
      expect(currentPageBtn).toHaveClass('bg-blue-600')
      
      const oldPageBtn = screen.getByRole('button', { name: '1' })
      expect(oldPageBtn).not.toHaveClass('bg-blue-600')
    })
  })

  describe('Performance', () => {
    it('renders efficiently with many pages', () => {
      expect(() => renderPagination({ 
        currentPage: 500, 
        totalPages: 1000 
      })).not.toThrow()
      
      // Should still show manageable number of page buttons
      const pageButtons = screen.getAllByRole('button').filter(btn => 
        /^\d+$/.test(btn.textContent || '')
      )
      expect(pageButtons.length).toBeLessThan(10) // Should not render all 1000 pages
    })
  })
})
