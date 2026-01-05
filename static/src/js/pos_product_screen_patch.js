/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { ProductScreen } from "@point_of_sale/app/screens/product_screen/product_screen";

patch(ProductScreen.prototype, {
    // ==========================================
    // 1️⃣ CUANDO ESCANEAN (Lógica de Barcode)
    // ==========================================
    async _barcodeProductAction(code) {
        console.log("🚀 [Odoo 18] Escaneo detectado:", code);

        // En Odoo 18 accedemos a los modelos a través de this.pos.models
        const product = this.pos.models["product.product"].find((p) => p.default_code === code);

        if (!product) {
            console.warn("❌ [Odoo 18] No hay producto con Ref. Interna:", code);
            this.barcodeReader.showNotFoundNotification(code);
            return;
        }

        console.log("✅ [Odoo 18] Producto encontrado por escaneo:", product.display_name);

        await this.pos.addLineToCurrentOrder(
            { product_id: product },
            { code }
        );

        this.numberBuffer.reset();
    },

    // ==========================================
    // 2️⃣ CUANDO ESCRIBEN EN EL BUSCADOR
    // ==========================================
    get searchWord() {
        const word = this.pos.searchProductWord ? this.pos.searchProductWord.trim() : "";

        if (word) {
            console.log("🔍 [Odoo 18] Buscando en caja de texto:", word);
            
            // En Odoo 18, los modelos son iterables o usamos .find()
            const product = this.pos.models["product.product"].find((p) => p.default_code === word);

            if (product) {
                console.log("🎯 [Odoo 18] Match encontrado en Ref. Interna:", product.display_name);

                // Agregar producto al pedido
                this.pos.addLineToCurrentOrder({ product_id: product });

                // Limpiar el buscador (Sintaxis Odoo 18)
                this.pos.searchProductWord = "";
                this.numberBuffer.reset();

                return "";
            }
        }

        return word;
    },
});