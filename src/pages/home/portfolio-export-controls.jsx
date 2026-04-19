import { useCallback, useEffect, useRef, useState } from "react";
import {
	buildPortfolioMarkdown,
	downloadMarkdownFile,
} from "../../utils/buildPortfolioMarkdown";
import "./portfolio-export-controls.css";

export function PortfolioExportControls() {
	const [modalOpen, setModalOpen] = useState(false);
	const [previewHtml, setPreviewHtml] = useState("");
	const [previewLoading, setPreviewLoading] = useState(false);
	const [pdfBusy, setPdfBusy] = useState(false);
	const [pdfError, setPdfError] = useState(null);
	const previewRef = useRef(null);
	const closeButtonRef = useRef(null);

	const closeModal = useCallback(() => {
		setModalOpen(false);
		setPreviewHtml("");
		setPreviewLoading(false);
		setPdfError(null);
	}, []);

	const openModal = useCallback(async () => {
		setPdfError(null);
		setModalOpen(true);
		setPreviewHtml("");
		setPreviewLoading(true);
		try {
			const { marked } = await import("marked");
			setPreviewHtml(marked.parse(buildPortfolioMarkdown()));
		} catch (err) {
			console.error(err);
			setPdfError("Could not load preview.");
		} finally {
			setPreviewLoading(false);
		}
	}, []);

	useEffect(() => {
		if (!modalOpen) return;
		const onKey = (e) => {
			if (e.key === "Escape") closeModal();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [modalOpen, closeModal]);

	useEffect(() => {
		if (!modalOpen) return;
		const prev = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = prev;
		};
	}, [modalOpen]);

	useEffect(() => {
		if (modalOpen && !previewLoading && previewHtml) {
			closeButtonRef.current?.focus();
		}
	}, [modalOpen, previewLoading, previewHtml]);

	const handleMarkdown = useCallback(() => {
		downloadMarkdownFile();
	}, []);

	const handlePdf = useCallback(async () => {
		const el = previewRef.current;
		if (!el) return;
		setPdfError(null);
		setPdfBusy(true);
		try {
			const mod = await import("html2pdf.js");
			const html2pdf = mod.default;

			await document.fonts.ready.catch(() => {});
			await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

			await html2pdf()
				.set({
					margin: [10, 10, 10, 10],
					filename: "maesela-portfolio.pdf",
					image: { type: "jpeg", quality: 0.92 },
					html2canvas: {
						scale: 2,
						useCORS: true,
						logging: false,
						scrollX: 0,
						scrollY: 0,
						backgroundColor: "#ffffff",
					},
					jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
					pagebreak: { mode: ["avoid-all", "css", "legacy"] },
				})
				.from(el)
				.save();
		} catch (err) {
			console.error(err);
			setPdfError("Could not generate PDF.");
		} finally {
			setPdfBusy(false);
		}
	}, []);

	return (
		<>
			<div
				className="portfolio-export-controls"
				role="group"
				aria-label="Export portfolio"
			>
				<button
					type="button"
					className="portfolio-export-btn"
					onClick={openModal}
				>
					Export portfolio
				</button>
			</div>

			{modalOpen ? (
				<div
					className="portfolio-export-modal-backdrop"
					role="presentation"
					onClick={closeModal}
				>
					<div
						className="portfolio-export-modal"
						role="dialog"
						aria-modal="true"
						aria-labelledby="portfolio-export-modal-title"
						onClick={(e) => e.stopPropagation()}
					>
						<header className="portfolio-export-modal-header">
							<h2 id="portfolio-export-modal-title">Export portfolio</h2>
							<button
								ref={closeButtonRef}
								type="button"
								className="portfolio-export-modal-close"
								onClick={closeModal}
								aria-label="Close"
							>
								×
							</button>
						</header>

						<div className="portfolio-export-modal-body">
							{previewLoading ? (
								<p className="portfolio-export-modal-loading">
									Loading preview…
								</p>
							) : pdfError && !previewHtml ? (
								<p className="portfolio-export-error" role="alert">
									{pdfError}
								</p>
							) : (
								<div
									ref={previewRef}
									className="portfolio-export-preview"
									// Trusted: generated from buildPortfolioMarkdown() + marked
									dangerouslySetInnerHTML={{ __html: previewHtml }}
								/>
							)}
						</div>

						<footer className="portfolio-export-modal-footer">
							{pdfError && previewHtml ? (
								<p className="portfolio-export-modal-footer-error" role="alert">
									{pdfError} Try Markdown or close and retry.
								</p>
							) : null}
							<div className="portfolio-export-modal-footer-actions">
								<button
									type="button"
									className="portfolio-export-btn"
									onClick={handleMarkdown}
									disabled={!previewHtml || previewLoading}
								>
									Download Markdown
								</button>
								<button
									type="button"
									className="portfolio-export-btn portfolio-export-btn-primary"
									onClick={handlePdf}
									disabled={!previewHtml || previewLoading || pdfBusy}
									aria-busy={pdfBusy}
								>
									{pdfBusy ? "Generating PDF…" : "Download PDF"}
								</button>
							</div>
						</footer>
					</div>
				</div>
			) : null}
		</>
	);
}
