const $ = window["jQuery"];

import { Node } from "./node";


export default class SelectNodeHandler {
    tree_widget;
    selected_nodes: Object;
    selected_single_node: Node | null;

    constructor(tree_widget) {
        this.tree_widget = tree_widget;
        this.clear();
    }

    getSelectedNode(): Node | false {
        const selected_nodes = this.getSelectedNodes();

        if (selected_nodes.length) {
            return selected_nodes[0];
        }
        else {
            return false
        }
    }

    getSelectedNodes(): Array<Node> {
        if (this.selected_single_node) {
            return [this.selected_single_node];
        }
        else {
            const selected_nodes = [];

            for (let id in this.selected_nodes) {
                const node = this.tree_widget.getNodeById(id);
                if (node) {
                    selected_nodes.push(node);
                }
            }

            return selected_nodes;
        }
    }

    getSelectedNodesUnder(parent: Node) {
        if (this.selected_single_node) {
            if (parent.isParentOf(this.selected_single_node)) {
                return [this.selected_single_node];
            }
            else {
                return [];
            }
        }
        else {
            const selected_nodes = []

            for (let id in this.selected_nodes) {
                const node = this.tree_widget.getNodeById(id);
                if (node && parent.isParentOf(node)) {
                    selected_nodes.push(node);
                }
            }

            return selected_nodes;
        }
    }

    isNodeSelected(node: Node | null): boolean {
        if (! node) {
            return false;
        }
        else if (node.id != null) {
            if (this.selected_nodes[node.id]) {
                return true;
            }
            else {
                return false;
            }
        }
        else if (this.selected_single_node) {
            return this.selected_single_node.element == node.element;
        }
        else {
            return false;
        }
    }

    clear() {
        this.selected_nodes = {};
        this.selected_single_node = null;
    }

    removeFromSelection(node: Node, include_children=false) {
        if (node.id == null) {
            if (this.selected_single_node && node.element == this.selected_single_node.element) {
                this.selected_single_node = null
            }
        }
        else {
            delete this.selected_nodes[node.id];

            if (include_children) {
                node.iterate(
                    (n) => {
                        delete this.selected_nodes[node.id];
                        return true;
                    }
                )
            }
        }
    }

    addToSelection(node: Node) {
        if (node.id != null) {
            this.selected_nodes[node.id] = true;
        }
        else {
            this.selected_single_node = node;
        }
    }
}