import * as $ from "jquery";
import getGiven from "givens";
import "../../tree.jquery";
import exampleData from "../support/exampleData";

const context = describe;

beforeEach(() => {
    $("body").append('<div id="tree1"></div>');
});

afterEach(() => {
    const $tree = $("#tree1");
    $tree.tree("destroy");
    $tree.remove();
});

describe("addNodeAfter", () => {
    interface Vars {
        node: INode;
        $tree: JQuery<HTMLElement>;
    }

    const given = getGiven<Vars>();
    given("$tree", () => $("#tree1"));
    given("node", () => given.$tree.tree("getNodeByNameMustExist", "node1"));

    beforeEach(() => {
        given.$tree.tree({
            autoOpen: true,
            data: exampleData,
        });

        given.$tree.tree("addNodeAfter", "added-node", given.node);
    });

    test("adds the node", () => {
        expect(given.$tree).toHaveTreeStructure([
            expect.objectContaining({ name: "node1" }),
            expect.objectContaining({ name: "added-node" }),
            expect.objectContaining({ name: "node2" }),
        ]);
    });
});

describe("addNodeBefore", () => {
    interface Vars {
        node: INode;
        $tree: JQuery<HTMLElement>;
    }

    const given = getGiven<Vars>();
    given("$tree", () => $("#tree1"));
    given("node", () => given.$tree.tree("getNodeByNameMustExist", "node1"));

    beforeEach(() => {
        given.$tree.tree({
            autoOpen: true,
            data: exampleData,
        });

        given.$tree.tree("addNodeBefore", "added-node", given.node);
    });

    test("adds the node", () => {
        expect(given.$tree).toHaveTreeStructure([
            expect.objectContaining({ name: "added-node" }),
            expect.objectContaining({ name: "node1" }),
            expect.objectContaining({ name: "node2" }),
        ]);
    });
});

describe("addParentNode", () => {
    interface Vars {
        child1: INode;
        $tree: JQuery<HTMLElement>;
    }

    const given = getGiven<Vars>();
    given("$tree", () => $("#tree1"));
    given("child1", () => given.$tree.tree("getNodeByNameMustExist", "child1"));

    beforeEach(() => {
        given.$tree.tree({
            autoOpen: true,
            data: exampleData,
        });

        given.$tree.tree("addParentNode", "new-parent-node", given.child1);
    });

    test("adds the parent node", () => {
        expect(given.$tree).toHaveTreeStructure([
            expect.objectContaining({
                name: "node1",
                children: [
                    expect.objectContaining({
                        name: "new-parent-node",
                        children: [
                            expect.objectContaining({ name: "child1" }),
                            expect.objectContaining({ name: "child2" }),
                        ],
                    }),
                ],
            }),
            expect.objectContaining({ name: "node2" }),
        ]);
    });
});

describe("addToSelection", () => {
    interface Vars {
        child1: INode;
        child2: INode;
        $tree: JQuery<HTMLElement>;
    }

    const given = getGiven<Vars>();
    given("$tree", () => $("#tree1"));
    given("child1", () => given.$tree.tree("getNodeByNameMustExist", "child1"));
    given("child2", () => given.$tree.tree("getNodeByNameMustExist", "child2"));

    beforeEach(() => {
        given.$tree.tree({
            autoOpen: true,
            data: exampleData,
        });

        given.$tree.tree("addToSelection", given.child1);
        given.$tree.tree("addToSelection", given.child2);
    });

    test("selects the nodes", () => {
        expect(given.$tree.tree("getSelectedNodes")).toEqual(
            expect.arrayContaining([given.child1, given.child2])
        );
    });

    test("renders the nodes correctly", () => {
        expect(given.$tree).toHaveTreeStructure([
            expect.objectContaining({
                name: "node1",
                selected: false,
                children: [
                    expect.objectContaining({ name: "child1", selected: true }),
                    expect.objectContaining({ name: "child2", selected: true }),
                ],
            }),
            expect.objectContaining({
                name: "node2",
                selected: false,
                children: [
                    expect.objectContaining({
                        name: "node3",
                        selected: false,
                    }),
                ],
            }),
        ]);
    });
});

describe("appendNode", () => {
    interface Vars {
        nodeData: NodeData;
        parent: INode | undefined;
        $tree: JQuery<HTMLElement>;
    }

    const given = getGiven<Vars>();
    given("$tree", () => $("#tree1"));
    given("parent", () => undefined);
    given("nodeData", () => "appended-node");

    beforeEach(() => {
        given.$tree.tree({
            autoOpen: true,
            data: exampleData,
        });

        given.$tree.tree("appendNode", given.nodeData, given.parent);
    });

    context("with an empty parent parameter", () => {
        test("appends the node to the tree", () => {
            expect(given.$tree).toHaveTreeStructure([
                expect.objectContaining({ name: "node1" }),
                expect.objectContaining({ name: "node2" }),
                expect.objectContaining({ name: "appended-node" }),
            ]);
        });
    });

    context("when appending to a parent node", () => {
        given("parent", () =>
            given.$tree.tree("getNodeByNameMustExist", "node1")
        );

        test("appends the node to parent node", () => {
            expect(given.$tree).toHaveTreeStructure([
                expect.objectContaining({
                    name: "node1",
                    children: [
                        expect.objectContaining({ name: "child1" }),
                        expect.objectContaining({ name: "child2" }),
                        expect.objectContaining({ name: "appended-node" }),
                    ],
                }),
                expect.objectContaining({ name: "node2" }),
            ]);
        });
    });

    context("when appending a node using an object", () => {
        given("nodeData", () => ({
            color: "green",
            id: 99,
            name: "appended-using-object",
        }));

        test("appends the node to the tree", () => {
            expect(given.$tree).toHaveTreeStructure([
                expect.objectContaining({
                    name: "node1",
                }),
                expect.objectContaining({ name: "node2" }),
                expect.objectContaining({ name: "appended-using-object" }),
            ]);
        });

        test("sets the properties of the object", () => {
            expect(given.$tree.tree("getNodeById", 99)).toMatchObject(
                given.nodeData
            );
        });
    });
});

describe("closeNode", () => {
    interface Vars {
        node1: INode;
        $tree: JQuery<HTMLElement>;
    }

    const given = getGiven<Vars>();
    given("node1", () => given.$tree.tree("getNodeByNameMustExist", "node1"));
    given("$tree", () => $("#tree1"));

    beforeEach(() => {
        given.$tree.tree({
            autoOpen: true,
            data: exampleData,
        });
        given.$tree.tree("closeNode", given.node1, false);
    });

    test("closes the node", () => {
        expect(given.node1.element).toBeClosed();
    });
});

describe("getNodeById", () => {
    interface Vars {
        $tree: JQuery<HTMLElement>;
    }

    const given = getGiven<Vars>();
    given("$tree", () => $("#tree1"));

    beforeEach(() => {
        given.$tree.tree({
            data: exampleData,
        });
    });

    test("returns the node", () => {
        expect(given.$tree.tree("getNodeById", 127)).toMatchObject({
            name: "node3",
        });
    });

    context("with a string parameter", () => {
        test("returns the node", () => {
            expect(given.$tree.tree("getNodeById", "127")).toMatchObject({
                name: "node3",
            });
        });
    });

    context("when the node doesn't exist", () => {
        test("returns undefined", () => {
            expect(given.$tree.tree("getNodeById", 99999)).toBeNull();
        });
    });
});

describe("getSelectedNode", () => {
    interface Vars {
        node: INode;
        $tree: JQuery<HTMLElement>;
        treeData: NodeData[];
    }

    const given = getGiven<Vars>();
    given("$tree", () => $("#tree1"));

    beforeEach(() => {
        given.$tree.tree({
            data: given.treeData,
        });
    });

    context("when nodes have ids", () => {
        given("node", () =>
            given.$tree.tree("getNodeByNameMustExist", "node1")
        );
        given("treeData", () => exampleData);

        context("when no node is selected", () => {
            test("returns false", () => {
                expect(given.$tree.tree("getSelectedNode")).toBe(false);
            });
        });

        context("when a node is selected", () => {
            beforeEach(() => {
                given.$tree.tree("selectNode", given.node);
            });

            test("returns the selected node", () => {
                expect(given.$tree.tree("getSelectedNode")).toBe(given.node);
            });
        });
    });

    context("when nodes don't have ids", () => {
        given("node", () =>
            given.$tree.tree("getNodeByNameMustExist", "without-id1")
        );
        given("treeData", () => ["without-id1", "without-id2"]);

        context("when no node is selected", () => {
            test("returns false", () => {
                expect(given.$tree.tree("getSelectedNode")).toBe(false);
            });
        });

        context("when a node is selected", () => {
            beforeEach(() => {
                given.$tree.tree("selectNode", given.node);
            });

            test("returns the selected node", () => {
                expect(given.$tree.tree("getSelectedNode")).toBe(given.node);
            });
        });
    });
});

describe("getSelectedNodes", () => {
    interface Vars {
        child1: INode;
        child2: INode;
        $tree: JQuery<HTMLElement>;
    }

    const given = getGiven<Vars>();
    given("child1", () => given.$tree.tree("getNodeByNameMustExist", "child1"));
    given("child2", () => given.$tree.tree("getNodeByNameMustExist", "child2"));
    given("$tree", () => $("#tree1"));

    beforeEach(() => {
        given.$tree.tree({
            data: exampleData,
        });
    });

    context("when no node is selected", () => {
        test("returns an empty array", () => {
            expect(given.$tree.tree("getSelectedNodes")).toHaveLength(0);
        });
    });

    context("when nodes are selected", () => {
        beforeEach(() => {
            given.$tree.tree("addToSelection", given.child1);
            given.$tree.tree("addToSelection", given.child2);
        });

        test("returns the selected nodes", () => {
            console.log(
                given.$tree.tree("getSelectedNodes").map((node) => node.name)
            );
            expect(given.$tree.tree("getSelectedNodes")).toEqual(
                expect.arrayContaining([given.child1, given.child2])
            );
        });
    });
});

describe("loadData", () => {
    interface Vars {
        initialNode: INode;
        $tree: JQuery<HTMLElement>;
    }

    const given = getGiven<Vars>();
    given("initialNode", () =>
        given.$tree.tree("getNodeByNameMustExist", "initial1")
    );
    given("$tree", () => $("#tree1"));

    beforeEach(() => {
        given.$tree.tree({
            data: ["initial1"],
        });
    });

    context("when the node parameter is empty", () => {
        beforeEach(() => {
            given.$tree.tree("loadData", exampleData);
        });

        test("replaces the whole tree", () => {
            expect(given.$tree).toHaveTreeStructure([
                expect.objectContaining({
                    name: "node1",
                    children: [
                        expect.objectContaining({ name: "child1" }),
                        expect.objectContaining({ name: "child2" }),
                    ],
                }),
                expect.objectContaining({
                    name: "node2",
                    children: [expect.objectContaining({ name: "node3" })],
                }),
            ]);
        });
    });

    context("with a node parameter", () => {
        beforeEach(() => {
            given.$tree.tree("loadData", exampleData, given.initialNode);
        });

        test("loads the data under the node", () => {
            expect(given.$tree).toHaveTreeStructure([
                expect.objectContaining({
                    name: "initial1",
                    children: [
                        expect.objectContaining({
                            name: "node1",
                            children: [
                                expect.objectContaining({ name: "child1" }),
                                expect.objectContaining({ name: "child2" }),
                            ],
                        }),
                        expect.objectContaining({ name: "node2" }),
                    ],
                }),
            ]);
        });
    });
});

describe("moveNode", () => {
    interface Vars {
        child1: INode;
        node2: INode;
        $tree: JQuery<HTMLElement>;
    }

    const given = getGiven<Vars>();
    given("child1", () => given.$tree.tree("getNodeByNameMustExist", "child1"));
    given("node2", () => given.$tree.tree("getNodeByNameMustExist", "node2"));
    given("$tree", () => $("#tree1"));

    beforeEach(() => {
        given.$tree.tree({
            autoOpen: true,
            data: exampleData,
        });
        given.$tree.tree("moveNode", given.child1, given.node2, "after");
    });

    test("moves node", () => {
        expect(given.$tree).toHaveTreeStructure([
            expect.objectContaining({
                name: "node1",
                children: [expect.objectContaining({ name: "child2" })],
            }),
            expect.objectContaining({ name: "node2" }),
            expect.objectContaining({ name: "child1" }),
        ]);
    });
});

describe("openNode", () => {
    interface Vars {
        node1: INode;
        $tree: JQuery<HTMLElement>;
    }

    const given = getGiven<Vars>();
    given("node1", () => given.$tree.tree("getNodeByNameMustExist", "node1"));
    given("$tree", () => $("#tree1"));

    beforeEach(() => {
        given.$tree.tree({
            autoOpen: false,
            data: exampleData,
        });
        given.$tree.tree("openNode", given.node1, false);
    });

    test("opens the node", () => {
        expect(given.node1.element).toBeOpen();
    });
});

describe("prependNode", () => {
    interface Vars {
        parent: INode | undefined;
        $tree: JQuery<HTMLElement>;
    }

    const given = getGiven<Vars>();
    given("$tree", () => $("#tree1"));
    given("parent", () => undefined);

    beforeEach(() => {
        given.$tree.tree({
            data: exampleData,
        });
        given.$tree.tree("prependNode", "prepended-node", given.parent);
    });

    context("with an empty parent parameter", () => {
        test("prepends the node to the tree", () => {
            expect(given.$tree).toHaveTreeStructure([
                expect.objectContaining({ name: "prepended-node" }),
                expect.objectContaining({ name: "node1" }),
                expect.objectContaining({ name: "node2" }),
            ]);
        });
    });

    context("with a parent node", () => {
        given("parent", () =>
            given.$tree.tree("getNodeByNameMustExist", "node1")
        );

        test("prepends the node to the parent", () => {
            expect(given.$tree).toHaveTreeStructure([
                expect.objectContaining({
                    name: "node1",
                    children: [
                        expect.objectContaining({ name: "prepended-node" }),
                        expect.objectContaining({ name: "child1" }),
                        expect.objectContaining({ name: "child2" }),
                    ],
                }),
                expect.objectContaining({ name: "node2" }),
            ]);
        });
    });
});

describe("removeNode", () => {
    interface Vars {
        node: INode;
        $tree: JQuery<HTMLElement>;
    }

    const given = getGiven<Vars>();
    given("$tree", () => $("#tree1"));

    beforeEach(() => {
        given.$tree.tree({
            data: exampleData,
        });
    });

    context("with a child node", () => {
        given("node", () =>
            given.$tree.tree("getNodeByNameMustExist", "child1")
        );

        test("removes the node", () => {
            given.$tree.tree("removeNode", given.node);

            expect(given.$tree).toHaveTreeStructure([
                expect.objectContaining({
                    name: "node1",
                    children: [expect.objectContaining({ name: "child2" })],
                }),
                expect.objectContaining({
                    name: "node2",
                    children: [expect.objectContaining({ name: "node3" })],
                }),
            ]);
        });

        context("when the node is selected", () => {
            beforeEach(() => {
                given.$tree.tree("selectNode", given.node);
            });

            test("removes and deselects the node", () => {
                given.$tree.tree("removeNode", given.node);

                expect(given.$tree.tree("getSelectedNode")).toBe(false);
            });
        });
    });

    context("with a parent node and its children", () => {
        given("node", () =>
            given.$tree.tree("getNodeByNameMustExist", "node1")
        );

        test("removes the node", () => {
            given.$tree.tree("removeNode", given.node);

            expect(given.$tree).toHaveTreeStructure([
                expect.objectContaining({
                    name: "node2",
                    children: [expect.objectContaining({ name: "node3" })],
                }),
            ]);
        });

        context("when a child node is selected", () => {
            beforeEach(() => {
                const child1 = given.$tree.tree(
                    "getNodeByNameMustExist",
                    "child1"
                );
                given.$tree.tree("selectNode", child1);
            });

            test("removes the node and deselects the child", () => {
                given.$tree.tree("removeNode", given.node);

                expect(given.$tree.tree("getSelectedNode")).toBe(false);
            });
        });
    });
});

describe("selectNode", () => {
    interface Vars {
        node1: INode;
        node2: INode;
        $tree: JQuery<HTMLElement>;
    }

    const given = getGiven<Vars>();
    given("node1", () => given.$tree.tree("getNodeByNameMustExist", "node1"));
    given("node2", () => given.$tree.tree("getNodeByNameMustExist", "node2"));
    given("$tree", () => $("#tree1"));

    beforeEach(() => {
        given.$tree.tree({
            data: exampleData,
            selectable: true,
        });
    });

    context("when another node is selected", () => {
        beforeEach(() => {
            given.$tree.tree("selectNode", given.node2);
            given.$tree.tree("selectNode", given.node1);
        });

        test("selects the node and deselects the previous node", () => {
            expect(given.node1.element).toBeSelected();
            expect(given.node2.element).notToBeSelected();
        });
    });

    context("when the node is not selected", () => {
        beforeEach(() => {
            given.$tree.tree("selectNode", given.node1);
        });

        test("selects the node", () => {
            expect(given.node1.element).toBeSelected();
        });
    });

    context("when the node is selected", () => {
        beforeEach(() => {
            given.$tree.tree("selectNode", given.node1);
            given.$tree.tree("selectNode", given.node1);
        });

        test("deselects the node", () => {
            expect(given.node1.element).notToBeSelected();
        });
    });
});

describe("toggle", () => {
    interface Vars {
        autoOpen: boolean;
        node1: INode;
        $tree: JQuery<HTMLElement>;
    }

    const given = getGiven<Vars>();
    given("autoOpen", () => false);
    given("node1", () => given.$tree.tree("getNodeByNameMustExist", "node1"));
    given("$tree", () => $("#tree1"));

    beforeEach(() => {
        given.$tree.tree({
            autoOpen: given.autoOpen,
            data: exampleData,
        });
        given.$tree.tree("toggle", given.node1, false);
    });

    context("when the node is closed", () => {
        test("opens the node", () => {
            expect(given.node1.element).toBeOpen();
        });
    });

    context("when the node is open", () => {
        given("autoOpen", () => true);

        test("closes the node", () => {
            expect(given.node1.element).toBeClosed();
        });
    });
});

describe("toJson", () => {
    interface Vars {
        $tree: JQuery<HTMLElement>;
    }

    const given = getGiven<Vars>();
    given("$tree", () => $("#tree1"));

    beforeEach(() => {
        given.$tree.tree({
            data: exampleData,
        });
    });

    test("returns nodes as json", () => {
        expect(JSON.parse(given.$tree.tree("toJson"))).toEqual(exampleData);
    });
});

describe("updateNode", () => {
    interface Vars {
        node: INode;
        nodeData: NodeData;
        $tree: JQuery<HTMLElement>;
    }

    const given = getGiven<Vars>();
    given("node", () => given.$tree.tree("getNodeByNameMustExist", "node1"));
    given("$tree", () => $("#tree1"));

    beforeEach(() => {
        given.$tree.tree({
            autoOpen: true,
            data: exampleData,
        });

        given.$tree.tree("updateNode", given.node, given.nodeData);
    });

    context("with a string", () => {
        given("nodeData", () => "updated-node");

        test("updates the name", () => {
            expect(given.$tree).toHaveTreeStructure([
                expect.objectContaining({ name: "updated-node" }),
                expect.objectContaining({ name: "node2" }),
            ]);
        });
    });

    context("with an object containing a name", () => {
        given("nodeData", () => ({ name: "updated-node" }));

        test("updates the name", () => {
            expect(given.$tree).toHaveTreeStructure([
                expect.objectContaining({ name: "updated-node" }),
                expect.objectContaining({ name: "node2" }),
            ]);
        });
    });

    context("with an object containing an id", () => {
        given("nodeData", () => ({ id: 999 }));

        test("updates the id", () => {
            expect(given.$tree).toHaveTreeStructure([
                expect.objectContaining({ name: "node1" }),
                expect.objectContaining({ name: "node2" }),
            ]);
            expect(given.$tree.tree("getNodeById", 999)).toMatchObject(
                given.nodeData
            );
        });
    });

    context("with an object containing a property", () => {
        given("nodeData", () => ({ color: "green" }));

        test("updates the node", () => {
            expect(given.$tree).toHaveTreeStructure([
                expect.objectContaining({ name: "node1" }),
                expect.objectContaining({ name: "node2" }),
            ]);
            expect(given.$tree.tree("getNodeById", 123)).toMatchObject({
                color: "green",
                name: "node1",
            });
        });
    });

    context("with an object containing children", () => {
        context("when adding a child to a child node", () => {
            given("nodeData", () => ({ children: ["new-child"] }));
            given("node", () =>
                given.$tree.tree("getNodeByNameMustExist", "child1")
            );

            test("adds the child node", () => {
                expect(given.$tree).toHaveTreeStructure([
                    expect.objectContaining({
                        name: "node1",
                        children: [
                            expect.objectContaining({
                                name: "child1",
                                children: [
                                    expect.objectContaining({
                                        name: "new-child",
                                    }),
                                ],
                            }),
                            expect.objectContaining({ name: "child2" }),
                        ],
                    }),
                    expect.objectContaining({ name: "node2" }),
                ]);
            });
        });

        context("when removing the children", () => {
            given("nodeData", () => ({ children: [] }));

            test("removes the children", () => {
                expect(given.$tree).toHaveTreeStructure([
                    expect.objectContaining({
                        nodeType: "child",
                        name: "node1",
                    }),
                    expect.objectContaining({
                        nodeType: "folder",
                        name: "node2",
                    }),
                ]);
            });
        });
    });
});