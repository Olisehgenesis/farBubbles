import Image from 'next/image'
import { memo } from 'react'
import { Token, TokenId } from '../app/config/tokens'
import CeloIcon from './CELO.svg'
import USDCIcon from './USDC.svg'
import USDTIcon from './USDT.svg'
import cEURIcon from './USDC.svg' // TODO: Fix this import - should be cEUR.svg
import cREALIcon from './cREAL.svg'
import cUSDIcon from './cUSD.svg'


interface Props {
  token?: Token | null
  size?: 'xs' | 's' | 'm' | 'l'
}

function _TokenIcon({ token, size = 'm' }: Props) {
  const { actualSize, fontSize } = sizeValues[size]

  // Debug logging
  console.log('TokenIcon render:', {
    token: token ? { id: token.id, symbol: token.symbol, name: token.name } : null,
    size,
    actualSize,
    fontSize
  })

  if (!token) {
    console.log('TokenIcon: No token provided, showing empty placeholder')
    return (
      <div
        className="flex items-center justify-center bg-white border border-gray-200 rounded-full"
        style={{
          width: actualSize,
          height: actualSize,
        }}
      ></div>
    )
  }

  let imgSrc
  if (token?.id === TokenId.CELO) {
    imgSrc = CeloIcon
    console.log('TokenIcon: Using CELO icon:', { imgSrc, tokenId: token.id })
  }
  else if (token?.id === TokenId.cUSD) {
    imgSrc = cUSDIcon
    console.log('TokenIcon: Using cUSD icon:', { imgSrc, tokenId: token.id })
  }
  else if (token?.id === TokenId.cEUR) {
    imgSrc = cEURIcon
    console.log('TokenIcon: Using cEUR icon (NOTE: Using USDC.svg as fallback):', { imgSrc, tokenId: token.id })
  }
  else if (token?.id === TokenId.cREAL) {
    imgSrc = cREALIcon
    console.log('TokenIcon: Using cREAL icon:', { imgSrc, tokenId: token.id })
  }
  else if (token?.id === TokenId.USDC) {
    imgSrc = USDCIcon
    console.log('TokenIcon: Using USDC icon:', { imgSrc, tokenId: token.id })
  }
  else if (token?.id === TokenId.USDT) {
    imgSrc = USDTIcon
    console.log('TokenIcon: Using USDT icon:', { imgSrc, tokenId: token.id })
  }
  else {
    console.log('TokenIcon: No matching icon found for token:', { tokenId: token.id, symbol: token.symbol })
  }

  if (imgSrc) {
    console.log('TokenIcon: Rendering Image component with:', { imgSrc, actualSize, tokenSymbol: token.symbol })
    return (
      <Image
        src={imgSrc}
        alt={`${token.symbol} icon`}
        width={actualSize}
        height={actualSize}
        priority={true}
        onLoad={() => {
          console.log('TokenIcon: Image loaded successfully:', { tokenSymbol: token.symbol, imgSrc })
        }}
        onError={(e) => {
          console.error('TokenIcon: Image failed to load:', { 
            tokenSymbol: token.symbol, 
            imgSrc, 
            error: e,
            target: e.target
          })
        }}
      />
    )
  }

  console.log('TokenIcon: Falling back to text-based icon for:', { tokenSymbol: token.symbol, color: token.color })
  return (
    <div
      className="flex items-center justify-center rounded-full"
      style={{
        width: actualSize,
        height: actualSize,
        backgroundColor: token.color || '#9CA4A9',
      }}
    >
      <div
        className="font-semibold text-white"
        style={{
          fontSize,
        }}
      >
        {token.symbol[0].toUpperCase()}
      </div>
    </div>
  )
}

const sizeValues = {
  xs: {
    actualSize: 22,
    fontSize: '13px',
  },
  s: {
    actualSize: 30,
    fontSize: '15px',
  },
  m: {
    actualSize: 40,
    fontSize: '18px',
  },
  l: {
    actualSize: 46,
    fontSize: '20px',
  },
}

export const TokenIcon = memo(_TokenIcon)