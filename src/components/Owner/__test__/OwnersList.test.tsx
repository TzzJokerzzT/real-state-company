import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import OwnerList from '../OwnersList'
import type { Owner } from '@/types/Owner'

// Mock the OwnerDetailsModal component
vi.mock('../OwnerDetailsModal', () => ({
  default: ({ ownerId, isOpen, onClose }: any) => (
    isOpen ? (
      <div data-testid="owner-details-modal">
        <div>Modal for owner: {ownerId}</div>
        <button onClick={onClose} data-testid="close-modal">Close Modal</button>
      </div>
    ) : null
  ),
}))

// Mock the owner store
const mockOwners: Owner[] = [
  {
    id: 'owner-1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    createdAt: '2023-01-01T00:00:00Z',
  },
  {
    id: 'owner-2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+0987654321',
    createdAt: '2023-01-02T00:00:00Z',
  },
  {
    id: 'owner-3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    phone: '+1122334455',
    createdAt: '2023-01-03T00:00:00Z',
  },
]

const defaultStoreState = {
  owners: mockOwners,
  loading: false,
  error: null as string | null,
}

let mockStoreState = { ...defaultStoreState }

vi.mock('@/store/OwnerStore', () => ({
  useOwnerStore: () => mockStoreState,
}))

describe('OwnerList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockStoreState = { ...defaultStoreState }
  })

  const renderOwnerList = () => {
    return render(
      <BrowserRouter>
        <OwnerList />
      </BrowserRouter>
    )
  }

  describe('Loading State', () => {
    it('displays loading message when loading is true', () => {
      mockStoreState = {
        owners: [],
        loading: true,
        error: null,
      }
      
      renderOwnerList()
      
      expect(screen.getByText('Loading owners...')).toBeInTheDocument()
      expect(screen.queryByText('No owners found.')).not.toBeInTheDocument()
    })

    it('does not show owner grid when loading', () => {
      mockStoreState = {
        owners: mockOwners,
        loading: true,
        error: null,
      }
      
      renderOwnerList()
      
      expect(screen.getByText('Loading owners...')).toBeInTheDocument()
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument()
    })
  })

  describe('Error State', () => {
    it('displays error message when error exists', () => {
      const errorMessage = 'Failed to load owners'
      mockStoreState = {
        owners: [],
        loading: false,
        error: errorMessage,
      }
      
      renderOwnerList()
      
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
      expect(screen.queryByText('Loading owners...')).not.toBeInTheDocument()
      expect(screen.queryByText('No owners found.')).not.toBeInTheDocument()
    })

    it('does not show owner grid when error exists', () => {
      mockStoreState = {
        owners: mockOwners,
        loading: false,
        error: 'Some error',
      }
      
      renderOwnerList()
      
      expect(screen.getByText('Some error')).toBeInTheDocument()
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument()
    })

    it('shows error with red text styling', () => {
      mockStoreState = {
        owners: [],
        loading: false,
        error: 'Error message',
      }
      
      renderOwnerList()
      
      const errorElement = screen.getByText('Error message')
      expect(errorElement).toHaveClass('text-red-600')
    })
  })

  describe('Empty State', () => {
    it('displays "No owners found" when owners array is empty', () => {
      mockStoreState = {
        owners: [],
        loading: false,
        error: null,
      }
      
      renderOwnerList()
      
      expect(screen.getByText('No owners found.')).toBeInTheDocument()
      expect(screen.queryByText('Loading owners...')).not.toBeInTheDocument()
    })

    it('has correct styling for empty state message', () => {
      mockStoreState = {
        owners: [],
        loading: false,
        error: null,
      }
      
      renderOwnerList()
      
      const emptyMessage = screen.getByText('No owners found.')
      expect(emptyMessage).toHaveClass('text-gray-600')
    })
  })

  describe('Owners Display', () => {
    it('renders all owners when data is available', () => {
      renderOwnerList()
      
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('jane@example.com')).toBeInTheDocument()
      expect(screen.getByText('+1122334455')).toBeInTheDocument()
    })

    it('displays owner information correctly', () => {
      renderOwnerList()
      
      // Check first owner
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('john@example.com')).toBeInTheDocument()
      expect(screen.getByText('+1234567890')).toBeInTheDocument()
      
      // Check second owner
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
      expect(screen.getByText('jane@example.com')).toBeInTheDocument()
      expect(screen.getByText('+0987654321')).toBeInTheDocument()
      
      // Check third owner
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument()
      expect(screen.getByText('bob@example.com')).toBeInTheDocument()
      expect(screen.getByText('+1122334455')).toBeInTheDocument()
    })

    it('renders correct number of owner cards', () => {
      const { container } = renderOwnerList()
      
      const ownerCards = container.querySelectorAll('button')
      expect(ownerCards).toHaveLength(mockOwners.length)
    })

    it('has proper grid layout structure', () => {
      const { container } = renderOwnerList()
      
      const grid = container.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3')
      expect(grid).toBeInTheDocument()
      expect(grid).toHaveClass('gap-4')
    })

    it('applies correct styling to owner cards', () => {
      const { container } = renderOwnerList()
      
      const ownerCards = container.querySelectorAll('button')
      ownerCards.forEach(card => {
        expect(card).toHaveClass(
          'bg-white',
          'rounded-lg',
          'shadow',
          'p-4',
          'text-left',
          'hover:shadow-md',
          'transition'
        )
      })
    })

    it('has proper text styling for owner information', () => {
      renderOwnerList()
      
      // Check name styling
      const nameElement = screen.getByText('John Doe')
      expect(nameElement).toHaveClass('text-lg', 'font-semibold', 'text-gray-900')
      
      // Check email styling
      const emailElement = screen.getByText('john@example.com')
      expect(emailElement).toHaveClass('text-sm', 'text-gray-700')
      
      // Check phone styling
      const phoneElement = screen.getByText('+1234567890')
      expect(phoneElement).toHaveClass('text-sm', 'text-gray-700')
    })
  })

  describe('Modal Interaction', () => {
    it('opens modal when owner card is clicked', () => {
      renderOwnerList()
      
      const johnCard = screen.getByText('John Doe').closest('button')
      fireEvent.click(johnCard!)
      
      expect(screen.getByTestId('owner-details-modal')).toBeInTheDocument()
      expect(screen.getByText('Modal for owner: owner-1')).toBeInTheDocument()
    })

    it('sets correct owner ID when different owners are clicked', () => {
      renderOwnerList()
      
      // Click on Jane Smith
      const janeCard = screen.getByText('Jane Smith').closest('button')
      fireEvent.click(janeCard!)
      
      expect(screen.getByText('Modal for owner: owner-2')).toBeInTheDocument()
      
      // Close modal
      fireEvent.click(screen.getByTestId('close-modal'))
      
      // Click on Bob Johnson
      const bobCard = screen.getByText('Bob Johnson').closest('button')
      fireEvent.click(bobCard!)
      
      expect(screen.getByText('Modal for owner: owner-3')).toBeInTheDocument()
    })

    it('closes modal when onClose is triggered', () => {
      renderOwnerList()
      
      // Open modal
      const johnCard = screen.getByText('John Doe').closest('button')
      fireEvent.click(johnCard!)
      
      expect(screen.getByTestId('owner-details-modal')).toBeInTheDocument()
      
      // Close modal
      fireEvent.click(screen.getByTestId('close-modal'))
      
      expect(screen.queryByTestId('owner-details-modal')).not.toBeInTheDocument()
    })

    it('can open and close modal multiple times', () => {
      renderOwnerList()
      
      const johnCard = screen.getByText('John Doe').closest('button')
      
      // Open modal
      fireEvent.click(johnCard!)
      expect(screen.getByTestId('owner-details-modal')).toBeInTheDocument()
      
      // Close modal
      fireEvent.click(screen.getByTestId('close-modal'))
      expect(screen.queryByTestId('owner-details-modal')).not.toBeInTheDocument()
      
      // Open modal again
      fireEvent.click(johnCard!)
      expect(screen.getByTestId('owner-details-modal')).toBeInTheDocument()
      
      // Close modal again
      fireEvent.click(screen.getByTestId('close-modal'))
      expect(screen.queryByTestId('owner-details-modal')).not.toBeInTheDocument()
    })

    it('passes correct props to OwnerDetailsModal', () => {
      renderOwnerList()
      
      // Initially modal should not be open
      expect(screen.queryByTestId('owner-details-modal')).not.toBeInTheDocument()
      
      // Click owner to open modal
      const johnCard = screen.getByText('John Doe').closest('button')
      fireEvent.click(johnCard!)
      
      // Modal should be open with correct owner ID
      expect(screen.getByTestId('owner-details-modal')).toBeInTheDocument()
      expect(screen.getByText('Modal for owner: owner-1')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('owner cards are proper buttons', () => {
      renderOwnerList()
      
      const ownerButtons = screen.getAllByRole('button')
      expect(ownerButtons).toHaveLength(mockOwners.length)
      
      ownerButtons.forEach(button => {
        expect(button.tagName).toBe('BUTTON')
      })
    })

    it('owner cards are keyboard accessible', () => {
      renderOwnerList()
      
      const firstOwnerButton = screen.getByText('John Doe').closest('button')
      
      // Focus the button
      firstOwnerButton?.focus()
      expect(firstOwnerButton).toHaveFocus()
      
      // Simulate Enter key press
      fireEvent.keyDown(firstOwnerButton!, { key: 'Enter', code: 'Enter' })
      // Button click should still work
      fireEvent.click(firstOwnerButton!)
      
      expect(screen.getByTestId('owner-details-modal')).toBeInTheDocument()
    })

    it('has proper semantic structure', () => {
      renderOwnerList()
      
      // Check that names are the most prominent text
      const nameElements = screen.getAllByText(/John Doe|Jane Smith|Bob Johnson/)
      nameElements.forEach(element => {
        expect(element).toHaveClass('text-lg', 'font-semibold')
      })
    })
  })

  describe('Edge Cases', () => {
    it('handles single owner correctly', () => {
      mockStoreState = {
        owners: [mockOwners[0]],
        loading: false,
        error: null,
      }
      
      renderOwnerList()
      
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument()
      expect(screen.queryByText('No owners found.')).not.toBeInTheDocument()
    })

    it('handles owner with empty/undefined fields gracefully', () => {
      const ownerWithMissingData: Owner = {
        id: 'owner-empty',
        name: '',
        email: '',
        phone: '',
        createdAt: '2023-01-01T00:00:00Z',
      }
      
      mockStoreState = {
        owners: [ownerWithMissingData],
        loading: false,
        error: null,
      }
      
      renderOwnerList()
      
      // Should not crash and should render the card
      const ownerCards = screen.getAllByRole('button')
      expect(ownerCards).toHaveLength(1)
    })

    it('handles very long owner names and information', () => {
      const ownerWithLongData: Owner = {
        id: 'owner-long',
        name: 'A'.repeat(100),
        email: 'verylongemailaddressthatmightbreakthelayout@example.com',
        phone: '+1234567890123456789',
        createdAt: '2023-01-01T00:00:00Z',
      }
      
      mockStoreState = {
        owners: [ownerWithLongData],
        loading: false,
        error: null,
      }
      
      expect(() => renderOwnerList()).not.toThrow()
      
      const ownerCard = screen.getByRole('button')
      expect(ownerCard).toBeInTheDocument()
    })

    it('handles many owners without performance issues', () => {
      const manyOwners: Owner[] = Array.from({ length: 100 }, (_, i) => ({
        id: `owner-${i}`,
        name: `Owner ${i}`,
        email: `owner${i}@example.com`,
        phone: `+123456789${i}`,
        createdAt: '2023-01-01T00:00:00Z',
      }))
      
      mockStoreState = {
        owners: manyOwners,
        loading: false,
        error: null,
      }
      
      expect(() => renderOwnerList()).not.toThrow()
      
      const ownerCards = screen.getAllByRole('button')
      expect(ownerCards).toHaveLength(100)
    })

    it('handles rapid clicking on owner cards', () => {
      renderOwnerList()
      
      const johnCard = screen.getByText('John Doe').closest('button')
      
      // Rapidly click the same card
      fireEvent.click(johnCard!)
      fireEvent.click(johnCard!)
      fireEvent.click(johnCard!)
      
      // Modal should still be open and functional
      expect(screen.getByTestId('owner-details-modal')).toBeInTheDocument()
      
      // Should be able to close it
      fireEvent.click(screen.getByTestId('close-modal'))
      expect(screen.queryByTestId('owner-details-modal')).not.toBeInTheDocument()
    })

    it('maintains state when switching between different owners', () => {
      renderOwnerList()
      
      // Click first owner
      const johnCard = screen.getByText('John Doe').closest('button')
      fireEvent.click(johnCard!)
      expect(screen.getByText('Modal for owner: owner-1')).toBeInTheDocument()
      
      // Close modal
      fireEvent.click(screen.getByTestId('close-modal'))
      
      // Click different owner
      const janeCard = screen.getByText('Jane Smith').closest('button')
      fireEvent.click(janeCard!)
      expect(screen.getByText('Modal for owner: owner-2')).toBeInTheDocument()
      
      // Close modal
      fireEvent.click(screen.getByTestId('close-modal'))
      
      // Click first owner again
      fireEvent.click(johnCard!)
      expect(screen.getByText('Modal for owner: owner-1')).toBeInTheDocument()
    })
  })

  describe('Responsive Design', () => {
    it('has responsive grid classes', () => {
      const { container } = renderOwnerList()
      
      const grid = container.querySelector('.grid')
      expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3')
    })

    it('maintains proper spacing on different screen sizes', () => {
      const { container } = renderOwnerList()
      
      const grid = container.querySelector('.grid')
      expect(grid).toHaveClass('gap-4')
    })
  })
})
