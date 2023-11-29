'use client'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar';

export function NavComponent({ links }: { links: any[] }) {

	return <>
		<Navbar className='bg-body-tertiary'>
			<Nav className="me-auto">
				{links.map((link, link_index) => (
					<Nav.Link key={link_index} href={link.link}>{link.text}</Nav.Link>
				))}
			</Nav>
			<Navbar.Collapse className='justify-content-end'>
				<Navbar.Text>
					Static site
				</Navbar.Text>
			</Navbar.Collapse>
		</Navbar>

	</>

}