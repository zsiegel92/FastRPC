'use client'
import { Spinner as RBSpinner } from 'react-bootstrap'
export async function Spinner() {
	return <div>
		<RBSpinner
			as="span"
			animation="border"
			size="sm"
			role="status"
			aria-hidden="true"
		/>
		Loading...
	</div>
}