import React from 'react'

const Footer = () => {
  return (
    <footer className='py-6 md:px-8 md:py-0 bg-black text-white border-t border-gray-800'>
			<div className='flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row'>
				<p className='text-balance text-center text-sm leading-loose text-muted-foreground md:text-left'>
                    Questions? Call <a href="tel:000-800-919-1743">000-800-919-1743</a> <br/>
					Netflix India
				</p>
			</div>
		</footer>
  )
}

export default Footer