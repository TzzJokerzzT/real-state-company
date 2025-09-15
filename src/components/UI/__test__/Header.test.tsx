import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import { Header } from '../Header/Header'
import type { Pagination } from '@/store/types'

// Mock react-router-dom
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Home: ({ className }: any) => <div className={`lucide-home ${className}`} data-testid="home-icon" />,
  Search: ({ className }: any) => <div className={`lucide-search ${className}`} data-testid="search-icon" />,
  Plus: ({ className }: any) => <div className={`lucide-plus ${className}`} data-testid="plus-icon" />,
}))

// Mock the ButtonComponent
vi.mock('../Button/Button', () => ({
  ButtonComponent: ({ children, onClick, className }: any) => (
    <button onClick={onClick} className={className} data-testid="button-component">
      {children}
    </button>
  ),
}))

describe('Header Component', () => {
  const mockPagination: Pagination = {
    currentPage: 1,
    totalPages: 5,
    totalCount: 50,
    pageSize: 10,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  const renderHeader = (pagination: Pagination = mockPagination) => {
    return render(
      <BrowserRouter>
        <Header pagination={pagination} />
      </BrowserRouter>
    )
  }

  describe('Rendering', () => {
    it('renders the header with all elements', () => {
      renderHeader()
      
      // Check for main header
      expect(screen.getByRole('banner')).toBeInTheDocument()
      
      // Check for title
      expect(screen.getByText('Real Estate Properties')).toBeInTheDocument()
      
      // Check for properties count
      expect(screen.getByText('50 properties found')).toBeInTheDocument()
      
      // Check for Add Property button
      expect(screen.getByText('Add Property')).toBeInTheDocument()
    })

    it('displays the correct structure with proper CSS classes', () => {
      renderHeader()
      
      const header = screen.getByRole('banner')
      expect(header).toHaveClass('bg-white', 'shadow-sm', 'border-b', 'border-gray-200')
      
      const title = screen.getByText('Real Estate Properties')
      expect(title).toHaveClass('text-2xl', 'font-bold', 'text-gray-900')
    })

    it('renders Home icon', () => {
      renderHeader()
      
      expect(screen.getByTestId('home-icon')).toBeInTheDocument()
    })

    it('renders Search icon', () => {
      renderHeader()
      
      expect(screen.getByTestId('search-icon')).toBeInTheDocument()
    })

    it('renders Plus icon in button', () => {
      renderHeader()
      
      expect(screen.getByTestId('plus-icon')).toBeInTheDocument()
    })
  })

  describe('Pagination Display', () => {
    it('displays correct count when there are properties', () => {
      const pagination = {
        currentPage: 1,
        totalPages: 3,
        totalCount: 25,
        pageSize: 10,
      }
      
      renderHeader(pagination)
      expect(screen.getByText('25 properties found')).toBeInTheDocument()
    })

    it('displays zero count correctly', () => {
      const pagination = {
        currentPage: 1,
        totalPages: 0,
        totalCount: 0,
        pageSize: 10,
      }
      
      renderHeader(pagination)
      expect(screen.getByText('0 properties found')).toBeInTheDocument()
    })

    it('displays single property count correctly', () => {
      const pagination = {
        currentPage: 1,
        totalPages: 1,
        totalCount: 1,
        pageSize: 10,
      }
      
      renderHeader(pagination)
      expect(screen.getByText('1 properties found')).toBeInTheDocument()
    })

    it('displays large count correctly', () => {
      const pagination = {
        currentPage: 10,
        totalPages: 100,
        totalCount: 1000,
        pageSize: 10,
      }
      
      renderHeader(pagination)
      expect(screen.getByText('1000 properties found')).toBeInTheDocument()
    })
  })

  describe('Navigation', () => {
    it('navigates to home when title is clicked', () => {
      renderHeader()
      
      const title = screen.getByText('Real Estate Properties')
      fireEvent.click(title)
      
      expect(mockNavigate).toHaveBeenCalledWith('/')
      expect(mockNavigate).toHaveBeenCalledTimes(1)
    })

    it('navigates to register property when Add Property button is clicked', () => {
      renderHeader()
      
      const addButton = screen.getByTestId('button-component')
      fireEvent.click(addButton)
      
      expect(mockNavigate).toHaveBeenCalledWith('/register-property')
      expect(mockNavigate).toHaveBeenCalledTimes(1)
    })

    it('title has cursor pointer styling', () => {
      renderHeader()
      
      const titleContainer = screen.getByText('Real Estate Properties').closest('div')
      expect(titleContainer).toHaveClass('hover:cursor-pointer')
    })
  })

  describe('Button Component Integration', () => {
    it('passes correct props to ButtonComponent', () => {
      renderHeader()
      
      const button = screen.getByTestId('button-component')
      expect(button).toHaveClass('flex', 'items-center', 'gap-2')
      expect(button).toHaveTextContent('Add Property')
    })

    it('ButtonComponent contains Plus icon and text', () => {
      renderHeader()
      
      const button = screen.getByTestId('button-component')
      expect(button).toHaveTextContent('Add Property')
      
      // Check if Plus icon is within the button
      expect(screen.getByTestId('plus-icon')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has proper semantic structure', () => {
      renderHeader()
      
      // Header should be a banner landmark
      expect(screen.getByRole('banner')).toBeInTheDocument()
      
      // Title should be a heading
      const title = screen.getByText('Real Estate Properties')
      expect(title.tagName).toBe('H1')
    })

    it('button is accessible', () => {
      renderHeader()
      
      const button = screen.getByRole('button', { name: /add property/i })
      expect(button).toBeInTheDocument()
      expect(button).toBeEnabled()
    })

    it('title is clickable and accessible', () => {
      renderHeader()
      
      const title = screen.getByText('Real Estate Properties')
      expect(title).toBeInTheDocument()
      
      // Should be clickable
      fireEvent.click(title)
      expect(mockNavigate).toHaveBeenCalled()
    })
  })

  describe('Layout and Responsive Design', () => {
    it('has proper container structure', () => {
      renderHeader()
      
      // Check for responsive container classes
      const container = document.querySelector('.max-w-7xl')
      expect(container).toBeInTheDocument()
      expect(container).toHaveClass('mx-auto', 'px-4', 'sm:px-6', 'lg:px-8')
    })

    it('has proper flex layout', () => {
      renderHeader()
      
      const flexContainer = document.querySelector('.flex.items-center.justify-between.h-16')
      expect(flexContainer).toBeInTheDocument()
    })

    it('has proper spacing between elements', () => {
      renderHeader()
      
      const rightSection = document.querySelector('.flex.items-center.gap-4')
      expect(rightSection).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('handles undefined pagination gracefully', () => {
      // This test ensures the component doesn't break with minimal pagination data
      const minimalPagination: Pagination = {
        currentPage: 0,
        totalPages: 0,
        totalCount: 0,
        pageSize: 0,
      }
      
      expect(() => renderHeader(minimalPagination)).not.toThrow()
      expect(screen.getByText('0 properties found')).toBeInTheDocument()
    })

    it('handles very large numbers', () => {
      const largePagination: Pagination = {
        currentPage: 1,
        totalPages: 999999,
        totalCount: 999999999,
        pageSize: 10,
      }
      
      renderHeader(largePagination)
      expect(screen.getByText('999999999 properties found')).toBeInTheDocument()
    })
  })

  describe('Multiple Interactions', () => {
    it('can handle multiple navigation clicks', () => {
      renderHeader()
      
      const title = screen.getByText('Real Estate Properties')
      const button = screen.getByTestId('button-component')
      
      // Click title multiple times
      fireEvent.click(title)
      fireEvent.click(title)
      
      // Click button multiple times
      fireEvent.click(button)
      fireEvent.click(button)
      
      expect(mockNavigate).toHaveBeenCalledTimes(4)
      expect(mockNavigate).toHaveBeenNthCalledWith(1, '/')
      expect(mockNavigate).toHaveBeenNthCalledWith(2, '/')
      expect(mockNavigate).toHaveBeenNthCalledWith(3, '/register-property')
      expect(mockNavigate).toHaveBeenNthCalledWith(4, '/register-property')
    })
  })
})
